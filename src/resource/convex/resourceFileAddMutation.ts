import { authMutation } from "@/utils/convex_backend/authMutation"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"

export type MeetingOrgAddMutationValidatorType = typeof resourceFileAddValidator.type

export const resourceFileAddFields = {
  resourceId: v.string(),
  fileId: v.string(),
} as const

export const resourceFileAddValidator = v.object(resourceFileAddFields)

export const resourceFileAddMutation = mutation({
  args: createTokenValidator(resourceFileAddFields),
  handler: async (ctx, args) => authMutation(ctx, args, resourceFileAddMutationFn),
})

export const resourceFileAddInternalMutation = internalMutation({
  args: resourceFileAddValidator,
  handler: resourceFileAddMutationFn,
})

export async function resourceFileAddMutationFn(
  ctx: MutationCtx,
  args: MeetingOrgAddMutationValidatorType,
): Promise<null> {
  const op = "resourceFileAddMutationFn"
  await ctx.db.insert("resourceFiles", {
    resourceId: args.resourceId,
    fileId: args.fileId,
    createdAt: nowIso(),
  })
  return null
}
