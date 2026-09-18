/// <reference types="vite/client" />

import { convexTest } from "convex-test"
import { expect, test, vi } from "vitest"
import { internal } from "../convex/_generated/api.js"
import schema from "../convex/schema.js"

const modules = import.meta.glob("../convex/**/*.ts")

test("resource deletion eventually removes every paginated relationship and the resource", async () => {
  vi.useFakeTimers()

  try {
    const t = convexTest(schema, modules)
    const resourceId = "resource-delete-pagination"
    const orgHandle = "resource-delete-org"
    const createdAt = "2026-09-18T00:00:00.000Z"

    await t.run(async (ctx) => {
      const orgId = await ctx.db.insert("orgs", {
        createdAt,
        orgHandle,
        updatedAt: createdAt,
      })
      await ctx.db.insert("resources", {
        createdAt,
        resourceId,
        updatedAt: createdAt,
      })

      for (let index = 0; index < 51; index += 1) {
        await ctx.db.insert("resourceFiles", {
          createdAt,
          fileId: `file-${index}`,
          resourceId,
        })
        await ctx.db.insert("orgResources", {
          createdAt,
          orgHandle,
          orgId,
          resourceId,
        })
      }
    })

    await t.mutation(internal.resource.resourceDeleteInternalMutation, { resourceId })
    await t.finishAllScheduledFunctions(() => vi.runAllTimers())

    const remainingResource = await t.run(async (ctx) =>
      ctx.db
        .query("resources")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .unique(),
    )
    const remainingResourceFiles = await t.run(async (ctx) =>
      ctx.db
        .query("resourceFiles")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .paginate({ numItems: 100, cursor: null }),
    )
    const remainingOrgResources = await t.run(async (ctx) =>
      ctx.db
        .query("orgResources")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .paginate({ numItems: 100, cursor: null }),
    )

    expect(remainingResource).toBeNull()
    expect(remainingResourceFiles).toMatchObject({ isDone: true, page: [] })
    expect(remainingOrgResources).toMatchObject({ isDone: true, page: [] })
  } finally {
    vi.useRealTimers()
  }
})

test("resource deletion blocks same-id recreation and relationship writes until cleanup finishes", async () => {
  vi.useFakeTimers()

  try {
    const t = convexTest(schema, modules)
    const resourceId = "resource-delete-recreate-race"
    const orgHandle = "resource-delete-race-org"
    const createdAt = "2026-09-18T00:00:00.000Z"

    const resourceDocId = await t.run(async (ctx) => {
      const orgId = await ctx.db.insert("orgs", {
        createdAt,
        orgHandle,
        updatedAt: createdAt,
      })
      const resourceDocId = await ctx.db.insert("resources", {
        createdAt,
        resourceId,
        updatedAt: createdAt,
      })
      await ctx.db.insert("resourceFiles", {
        createdAt,
        fileId: "file-before-delete",
        resourceId,
      })
      await ctx.db.insert("orgResources", {
        createdAt,
        orgHandle,
        orgId,
        resourceId,
      })
      return resourceDocId
    })

    await t.mutation(internal.resource.resourceDeleteInternalMutation, { resourceId })

    const pendingResource = await t.run(async (ctx) =>
      ctx.db
        .query("resources")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .unique(),
    )
    expect(pendingResource?.deletedAt).toEqual(expect.any(String))

    const recreateResult = await t.mutation(internal.resource.resourceCreateInternalMutation, { resourceId })
    expect(recreateResult.success).toBe(false)

    const fileAddResult = await t.mutation(internal.resource.resourceFileAddInternalMutation, {
      fileId: "file-during-delete",
      resourceId,
    })
    expect(fileAddResult.success).toBe(false)

    const orgAddResult = await t.mutation(internal.org.orgResourceAddInternalMutation, {
      orgHandle,
      resourceId,
    })
    expect(orgAddResult.success).toBe(false)

    await t.finishAllScheduledFunctions(() => vi.runAllTimers())

    const deletedResource = await t.run(async (ctx) =>
      ctx.db
        .query("resources")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .unique(),
    )
    const deletedResourceFiles = await t.run(async (ctx) =>
      ctx.db
        .query("resourceFiles")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .paginate({ numItems: 10, cursor: null }),
    )
    const deletedOrgResources = await t.run(async (ctx) =>
      ctx.db
        .query("orgResources")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .paginate({ numItems: 10, cursor: null }),
    )
    expect(deletedResource).toBeNull()
    expect(deletedResourceFiles).toMatchObject({ isDone: true, page: [] })
    expect(deletedOrgResources).toMatchObject({ isDone: true, page: [] })

    const recreatedResult = await t.mutation(internal.resource.resourceCreateInternalMutation, { resourceId })
    expect(recreatedResult.success).toBe(true)

    const newFileAddResult = await t.mutation(internal.resource.resourceFileAddInternalMutation, {
      fileId: "file-after-delete",
      resourceId,
    })
    expect(newFileAddResult.success).toBe(true)

    const newOrgAddResult = await t.mutation(internal.org.orgResourceAddInternalMutation, {
      orgHandle,
      resourceId,
    })
    expect(newOrgAddResult.success).toBe(true)

    await t.mutation(internal.resource.resourceFileRelationshipsDeleteInternalMutation, {
      resourceDocId,
      resourceId,
      paginationOpts: { numItems: 50, cursor: null },
    })
    await t.mutation(internal.resource.resourceOrgResourcesDeleteInternalMutation, {
      resourceDocId,
      resourceId,
      paginationOpts: { numItems: 50, cursor: null },
    })

    const recreatedResource = await t.run(async (ctx) =>
      ctx.db
        .query("resources")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .unique(),
    )
    const recreatedResourceFiles = await t.run(async (ctx) =>
      ctx.db
        .query("resourceFiles")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .paginate({ numItems: 10, cursor: null }),
    )
    const recreatedOrgResources = await t.run(async (ctx) =>
      ctx.db
        .query("orgResources")
        .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
        .paginate({ numItems: 10, cursor: null }),
    )
    expect(recreatedResource).not.toBeNull()
    expect(recreatedResourceFiles.page).toHaveLength(1)
    expect(recreatedResourceFiles.page[0]?.fileId).toBe("file-after-delete")
    expect(recreatedOrgResources.page).toHaveLength(1)
  } finally {
    vi.useRealTimers()
  }
})
