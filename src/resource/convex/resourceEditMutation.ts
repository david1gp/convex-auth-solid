import { v } from "convex/values"
import * as a from "valibot"
import { internal } from "#convex/_generated/api.js"
import { internalMutation, type MutationCtx, mutation } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { DocResource } from "#src/resource/convex/IdResource.ts"
import { resourceSearchProjection } from "#src/resource/convex/resourceSearchProjection.ts"
import { resourceDataSchemaFields } from "#src/resource/model/resourceSchema.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { paginationDefaultOptions } from "#src/utils/convex_backend/paginationDefaultOptions.ts"
import { paginationOptsValidator } from "#src/utils/convex_backend/paginationOptsValidator.ts"
import { nowIso } from "#utils/date/nowIso.js"

export const resourceEditFields = {
  ...valibotToConvex(resourceDataSchemaFields),
  // Files
  fileIds: v.optional(v.array(v.string())),
}
export const resourceEditValidator = v.object(resourceEditFields)
export type ResourceEditValidatorType = typeof resourceEditValidator.type

export const resourceEditMutation = mutation({
  args: createTokenValidator(resourceEditFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, resourceEditFn),
})

export const resourceEditInternalMutation = internalMutation({
  args: resourceEditValidator,
  handler: resourceEditFn,
})

const resourceEditOrgResourceProjectionsFields = {
  resourceId: v.string(),
  paginationOpts: paginationOptsValidator,
} as const

const resourceEditOrgResourceProjectionsValidator = v.object(resourceEditOrgResourceProjectionsFields)

export const resourceEditOrgResourceProjectionsInternalMutation = internalMutation({
  args: resourceEditOrgResourceProjectionsValidator,
  handler: resourceEditOrgResourceProjectionsFn,
})

export async function resourceEditFn(ctx: MutationCtx, args: ResourceEditValidatorType): PromiseResult<null> {
  const op = "resourceEditFn"

  const schema = a.object({
    ...resourceDataSchemaFields,
    fileIds: a.optional(a.array(a.string())),
  })

  const parse = a.safeParse(schema, args)
  if (!parse.success) {
    return createResultError(op, a.summarize(parse.issues))
  }
  const { resourceId, fileIds, ...rest } = parse.output

  const resource = await ctx.db
    .query("resources")
    .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
    .unique()
  if (!resource) {
    return createResultError(op, "Resource not found", resourceId)
  }
  if (resource.deletedAt) {
    return createResultError(op, "Resource is being deleted", resourceId)
  }

  // Update file assignments if provided
  if (fileIds !== undefined) {
    const updateResult = await updateAssignedFileIds(ctx, resourceId, fileIds)
    if (!updateResult.success) {
      return updateResult
    }
  }

  // const { resourceId, ...rest } = args
  const patch: Partial<DocResource> = rest
  const searchProjection = resourceSearchProjection({ ...resource, ...rest })
  Object.assign(patch, searchProjection)
  patch.updatedAt = nowIso()

  await ctx.db.patch("resources", resource._id, patch)
  await ctx.scheduler.runAfter(0, internal.resource.resourceEditOrgResourceProjectionsInternalMutation, {
    resourceId: resource.resourceId,
    paginationOpts: paginationDefaultOptions,
  })
  return createResult(null)
}

async function resourceEditOrgResourceProjectionsFn(
  ctx: MutationCtx,
  args: typeof resourceEditOrgResourceProjectionsValidator.type,
): Promise<null> {
  const paginationOpts = args.paginationOpts ?? paginationDefaultOptions
  const resource = await ctx.db
    .query("resources")
    .withIndex("resourceId", (q) => q.eq("resourceId", args.resourceId))
    .unique()

  if (!resource) {
    await ctx.scheduler.runAfter(0, internal.resource.resourceOrgResourcesDeleteInternalMutation, {
      resourceId: args.resourceId,
      paginationOpts,
    })
    return null
  }

  const searchProjection = resourceSearchProjection(resource)
  const result = await ctx.db
    .query("orgResources")
    .withIndex("resourceId", (q) => q.eq("resourceId", args.resourceId))
    .paginate(paginationOpts)

  await Promise.all(result.page.map((orgResource) => ctx.db.patch("orgResources", orgResource._id, searchProjection)))

  if (!result.isDone) {
    await ctx.scheduler.runAfter(0, internal.resource.resourceEditOrgResourceProjectionsInternalMutation, {
      resourceId: args.resourceId,
      paginationOpts: { ...paginationOpts, cursor: result.continueCursor },
    })
  }

  return null
}

export async function updateAssignedFileIds(
  ctx: MutationCtx,
  resourceId: string,
  fileIds: string[],
): PromiseResult<null> {
  // Get current file assignments for this resource
  const existing = await ctx.db
    .query("resourceFiles")
    .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
    .collect()

  const currentFileIds = new Set(existing.map((e) => e.fileId))
  const newFileIds = new Set(fileIds)

  // Find files to add (in new but not in current)
  const toAdd = fileIds.filter((fileId) => !currentFileIds.has(fileId))

  // Find files to remove (in current but not in new)
  const toRemove = existing.filter((e) => !newFileIds.has(e.fileId))

  // Add new file assignments
  if (toAdd.length > 0) {
    const filesToAdd = await Promise.all(
      toAdd.map((fileId) =>
        ctx.db
          .query("files")
          .withIndex("fileId", (q) => q.eq("fileId", fileId))
          .first(),
      ),
    )
    for (const file of filesToAdd) {
      if (!file) continue
      await ctx.db.insert("resourceFiles", {
        resourceId: resourceId,
        fileId: file.fileId,
        createdAt: nowIso(),
      })
    }
  }

  // Remove old file assignments
  for (const assignment of toRemove) {
    await ctx.db.delete("resourceFiles", assignment._id)
  }

  return createResult(null)
}
