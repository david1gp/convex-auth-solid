import { v } from "convex/values"
import { internal } from "#convex/_generated/api.js"
import { internalMutation, type MutationCtx, mutation } from "#convex/_generated/server.js"
import { resourceFileListFn } from "#src/resource/convex/resourceFileListQuery.ts"
import { resourceFileRemoveMutationFn } from "#src/resource/convex/resourceFileRemoveMutation.ts"
import { authMutationWrapResult } from "#src/utils/convex_backend/authMutationWrapResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { paginationDefaultOptions } from "#src/utils/convex_backend/paginationDefaultOptions.ts"
import { paginationOptsValidator } from "#src/utils/convex_backend/paginationOptsValidator.ts"

export type ResourceDeleteValidatorType = typeof resourceDeleteValidator.type

export const resourceDeleteFields = {
  resourceId: v.string(),
} as const

export const resourceDeleteValidator = v.object(resourceDeleteFields)

export const resourceDeleteMutation = mutation({
  args: createTokenValidator(resourceDeleteFields),
  handler: async (ctx, args) => authMutationWrapResult(ctx, args, resourceDeleteFn),
})

export const resourceDeleteInternalMutation = internalMutation({
  args: resourceDeleteValidator,
  handler: resourceDeleteFn,
})

const resourceOrgResourcesDeleteFields = {
  resourceId: v.string(),
  paginationOpts: paginationOptsValidator,
} as const

const resourceOrgResourcesDeleteValidator = v.object(resourceOrgResourcesDeleteFields)

export const resourceOrgResourcesDeleteInternalMutation = internalMutation({
  args: resourceOrgResourcesDeleteValidator,
  handler: resourceOrgResourcesDeleteFn,
})

export async function resourceDeleteFn(ctx: MutationCtx, args: ResourceDeleteValidatorType): Promise<null> {
  const resourceId = args.resourceId
  const resource = await ctx.db
    .query("resources")
    .withIndex("resourceId", (q) => q.eq("resourceId", args.resourceId))
    .unique()
  if (!resource) {
    await resourceOrgResourcesDeleteFn(ctx, { resourceId, paginationOpts: paginationDefaultOptions })
    return null // idempotent
  }
  // delete all files
  let cursor: string | null = null
  let isDone = false
  while (!isDone) {
    const files = await resourceFileListFn(ctx, {
      resourceId,
      paginationOpts: { ...paginationDefaultOptions, cursor },
    })
    await Promise.all(files.page.map((f) => resourceFileRemoveMutationFn(ctx, { resourceId, fileId: f.fileId })))
    isDone = files.isDone
    cursor = isDone ? null : files.continueCursor
  }
  await resourceOrgResourcesDeleteFn(ctx, { resourceId, paginationOpts: paginationDefaultOptions })
  // delete resource
  await ctx.db.delete("resources", resource._id)
  return null
}

async function resourceOrgResourcesDeleteFn(
  ctx: MutationCtx,
  args: typeof resourceOrgResourcesDeleteValidator.type,
): Promise<null> {
  const paginationOpts = args.paginationOpts ?? paginationDefaultOptions
  const result = await ctx.db
    .query("orgResources")
    .withIndex("resourceId", (q) => q.eq("resourceId", args.resourceId))
    .paginate(paginationOpts)

  await Promise.all(result.page.map((orgResource) => ctx.db.delete("orgResources", orgResource._id)))

  if (!result.isDone) {
    await ctx.scheduler.runAfter(0, internal.resource.resourceOrgResourcesDeleteInternalMutation, {
      resourceId: args.resourceId,
      paginationOpts: { ...paginationOpts, cursor: result.continueCursor },
    })
  }

  return null
}
