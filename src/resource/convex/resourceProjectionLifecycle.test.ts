import { expect, test } from "bun:test"
import type { MutationCtx } from "#convex/_generated/server.js"
import { orgCleanupIfEmptyFn } from "#src/org/org_convex/orgCleanupIfEmptyMutation.ts"
import { orgDeleteMutationFn } from "#src/org/org_convex/orgDeleteMutation.ts"
import { resourceDeleteFn, resourceOrgResourcesDeleteInternalMutation } from "./resourceDeleteMutation.ts"
import { resourceEditOrgResourceProjectionsInternalMutation as resourceEditProjectionMutation } from "./resourceEditMutation.ts"
import { resourceSearchProjectionBackfillInternalMutation } from "./resourceSearchProjectionBackfillMutation.ts"

type QueryResult = {
  page: Array<Record<string, unknown>>
  isDone: boolean
  continueCursor: string
}

type MutationHandler = (ctx: MutationCtx, args: Record<string, unknown>) => Promise<unknown>

function mutationHandler(mutation: unknown): MutationHandler {
  return (mutation as { _handler: MutationHandler })._handler
}

function createCtx(options: {
  resources?: Array<Record<string, unknown>>
  orgResources?: Array<Record<string, unknown>>
  files?: Array<Record<string, unknown>>
  members?: Array<Record<string, unknown>>
  pages?: Record<string, QueryResult>
}) {
  const deleted: Array<[string, string]> = []
  const patched: Array<[string, string, Record<string, unknown>]> = []
  const scheduled: Array<{ args: Record<string, unknown> }> = []
  const resources = options.resources ?? []
  const orgResources = options.orgResources ?? []
  const files = options.files ?? []
  const members = options.members ?? []

  const ctx = {
    db: {
      query(table: string) {
        const query = {
          withIndex() {
            return query
          },
          filter() {
            return query
          },
          unique: async () => {
            if (table === "resources") return resources[0]
            if (table === "orgs") return resources[0]
            return undefined
          },
          first: async () => {
            if (table === "resources") return resources[0]
            if (table === "orgs") return resources[0]
            return undefined
          },
          collect: async () => {
            if (table === "orgMembers") return members
            return []
          },
          paginate: async (paginationOpts: { cursor?: string | null }) => {
            const page = options.pages?.[table]
            if (page) return page
            if (table === "orgResources") {
              return {
                page: orgResources,
                isDone: true,
                continueCursor: paginationOpts.cursor ?? "cursor-done",
              }
            }
            if (table === "resourceFiles") {
              return {
                page: files,
                isDone: true,
                continueCursor: paginationOpts.cursor ?? "cursor-done",
              }
            }
            return {
              page: resources,
              isDone: true,
              continueCursor: paginationOpts.cursor ?? "cursor-done",
            }
          },
        }
        return query
      },
      get: async (_table: string, id: string) => resources.find((resource) => resource._id === id),
      delete: async (table: string, id: string) => {
        deleted.push([table, id])
      },
      patch: async (table: string, id: string, patch: Record<string, unknown>) => {
        patched.push([table, id, patch])
        if (table === "resources") {
          const resource = resources.find((entry) => entry._id === id)
          if (resource) Object.assign(resource, patch)
        }
      },
    },
    scheduler: {
      runAfter: async (_delay: number, _mutation: unknown, args: Record<string, unknown>) => {
        scheduled.push({ args })
      },
    },
  } as unknown as MutationCtx

  return { ctx, deleted, patched, scheduled }
}

test("resource deletion schedules organization projection cleanup after file cleanup", async () => {
  const { ctx, deleted, patched, scheduled } = createCtx({
    resources: [{ _id: "resource-doc", resourceId: "resource-1" }],
    pages: {
      orgResources: {
        page: [{ _id: "org-resource-doc", resourceId: "resource-1" }],
        isDone: false,
        continueCursor: "cursor-next",
      },
    },
  })

  await resourceDeleteFn(ctx, { resourceId: "resource-1" })

  expect(deleted).toEqual([])
  expect(patched).toEqual([["resources", "resource-doc", { deletedAt: expect.any(String) }]])
  expect(scheduled).toHaveLength(1)
  expect(scheduled[0]?.args).toMatchObject({
    resourceId: "resource-1",
    paginationOpts: { cursor: null },
  })
})

test("final organization projection cleanup deletes the tombstoned resource after its last page", async () => {
  const { ctx, deleted, scheduled } = createCtx({
    resources: [{ _id: "resource-doc", resourceId: "resource-1", deletedAt: "2026-09-18T00:00:00.000Z" }],
    pages: {
      orgResources: {
        page: [{ _id: "org-resource-doc", resourceId: "resource-1" }],
        isDone: true,
        continueCursor: "cursor-done",
      },
    },
  })

  await mutationHandler(resourceOrgResourcesDeleteInternalMutation)(ctx, {
    resourceDocId: "resource-doc",
    resourceId: "resource-1",
    paginationOpts: { numItems: 50, cursor: null },
  })

  expect(deleted).toEqual([
    ["orgResources", "org-resource-doc"],
    ["resources", "resource-doc"],
  ])
  expect(scheduled).toHaveLength(0)
})

test("idempotent resource deletion schedules orphan projection cleanup after file cleanup", async () => {
  const { ctx, deleted, scheduled } = createCtx({
    orgResources: [{ _id: "orphan-org-resource", resourceId: "missing-resource" }],
  })

  await resourceDeleteFn(ctx, { resourceId: "missing-resource" })

  expect(deleted).toEqual([])
  expect(scheduled).toHaveLength(1)
  expect(scheduled[0]?.args).toMatchObject({
    resourceId: "missing-resource",
    paginationOpts: { cursor: null },
  })
})

test("organization deletion removes its resource projections", async () => {
  const { ctx, deleted } = createCtx({
    resources: [{ _id: "org-doc", orgHandle: "adaptive" }],
    pages: {
      orgResources: {
        page: [{ _id: "org-resource-doc", orgId: "org-doc" }],
        isDone: true,
        continueCursor: "cursor-done",
      },
    },
  })

  await orgDeleteMutationFn(ctx, { orgHandle: "adaptive" })

  expect(deleted).toEqual([
    ["orgResources", "org-resource-doc"],
    ["orgs", "org-doc"],
  ])
})

test("idempotent organization deletion removes orphan projections", async () => {
  const { ctx, deleted } = createCtx({
    pages: {
      orgResources: {
        page: [{ _id: "orphan-org-resource", orgId: "missing-org" }],
        isDone: true,
        continueCursor: "cursor-done",
      },
    },
  })

  await orgDeleteMutationFn(ctx, { orgHandle: "adaptive" })

  expect(deleted).toEqual([["orgResources", "orphan-org-resource"]])
})

test("empty organization cleanup schedules projection deletion before deleting the organization", async () => {
  const { ctx, deleted, scheduled } = createCtx({
    resources: [{ _id: "org-doc", orgHandle: "adaptive" }],
  })

  await orgCleanupIfEmptyFn(ctx, { orgHandle: "adaptive" })

  expect(deleted).toEqual([["orgs", "org-doc"]])
  expect(scheduled).toHaveLength(1)
  expect(scheduled[0]?.args).toMatchObject({
    orgId: "org-doc",
    orgHandle: "adaptive",
    paginationOpts: { cursor: null },
  })
})

test("resource projection fanout reads current resource data and schedules the next page", async () => {
  const { ctx, patched, scheduled } = createCtx({
    resources: [
      {
        resourceId: "resource-1",
        name: "Latest name",
        description: "Latest description",
        type: "report",
        visibility: "public",
        language: "en",
      },
    ],
    pages: {
      orgResources: {
        page: [{ _id: "org-resource-doc" }],
        isDone: false,
        continueCursor: "cursor-next",
      },
    },
  })

  await mutationHandler(resourceEditProjectionMutation)(ctx, {
    resourceId: "resource-1",
    paginationOpts: { numItems: 1, cursor: null },
  })

  expect(patched).toEqual([
    [
      "orgResources",
      "org-resource-doc",
      {
        searchText: "Latest name Latest description",
        type: "report",
        visibility: "public",
        language: "en",
      },
    ],
  ])
  expect(scheduled).toHaveLength(1)
  expect(scheduled[0]?.args).toMatchObject({
    resourceId: "resource-1",
    paginationOpts: { numItems: 1, cursor: "cursor-next" },
  })
})

test("projection backfill deletes org resource orphans", async () => {
  const { ctx, deleted, patched } = createCtx({
    pages: {
      resources: { page: [], isDone: true, continueCursor: "cursor-done" },
      orgResources: {
        page: [{ _id: "orphan-org-resource", resourceId: "missing-resource" }],
        isDone: true,
        continueCursor: "cursor-done",
      },
    },
  })

  await mutationHandler(resourceSearchProjectionBackfillInternalMutation)(ctx, {
    target: "orgResources",
    paginationOpts: { numItems: 1, cursor: null },
  })

  expect(deleted).toEqual([["orgResources", "orphan-org-resource"]])
  expect(patched).toEqual([])
})
