import { authMutation } from "@/utils/convex_backend/authMutation"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export type MeetingOrgRemoveMutationValidatorType = typeof resourceFileRemoveValidator.type

export const resourceFileRemoveFields = {
  resourceId: v.string(),
  fileId: v.string(),
} as const

export const resourceFileRemoveValidator = v.object(resourceFileRemoveFields)

export const resourceFileRemoveMutation = mutation({
  args: createTokenValidator(resourceFileRemoveFields),
  handler: async (ctx, args) => authMutation(ctx, args, resourceFileRemoveMutationFn),
})

export const resourceFileRemoveInternalMutation = internalMutation({
  args: resourceFileRemoveValidator,
  handler: resourceFileRemoveMutationFn,
})

export async function resourceFileRemoveMutationFn(
  ctx: MutationCtx,
  args: MeetingOrgRemoveMutationValidatorType,
): Promise<null> {
  const op = "resourceFileRemoveMutationFn"
  const list = await ctx.db
    .query("resourceFiles")
    .withIndex("resourceId", (q) => q.eq("resourceId", args.resourceId))
    .filter((q) => q.eq(q.field("fileId"), args.fileId))
    .collect()
  await Promise.all(list.map((e) => ctx.db.delete("resourceFiles", e._id)))
  return null
}
