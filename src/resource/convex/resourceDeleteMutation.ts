import { resourceFileListFn } from "@/resource/convex/resourceFileListQuery"
import { resourceFileRemoveMutationFn } from "@/resource/convex/resourceFileRemoveMutation"
import { authMutation } from "@/utils/convex_backend/authMutation"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export type ResourceDeleteValidatorType = typeof resourceDeleteValidator.type

export const resourceDeleteFields = {
  resourceId: v.string(),
} as const

export const resourceDeleteValidator = v.object(resourceDeleteFields)

export const resourceDeleteMutation = mutation({
  args: createTokenValidator(resourceDeleteFields),
  handler: async (ctx, args) => authMutation(ctx, args, resourceDeleteFn),
})

export const resourceDeleteInternalMutation = internalMutation({
  args: resourceDeleteValidator,
  handler: resourceDeleteFn,
})

export async function resourceDeleteFn(ctx: MutationCtx, args: ResourceDeleteValidatorType): Promise<null> {
  const resourceId = args.resourceId
  const resource = await ctx.db
    .query("resources")
    .withIndex("resourceId", (q) => q.eq("resourceId", args.resourceId))
    .unique()
  if (!resource) return null // idempotent
  // delete all files
  const files = await resourceFileListFn(ctx, { resourceId })
  await Promise.all(files.map((f) => resourceFileRemoveMutationFn(ctx, { resourceId, fileId: f.fileId })))
  // delete resource
  await ctx.db.delete("resources", resource._id)
  return null
}
