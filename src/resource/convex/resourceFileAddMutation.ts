import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { authMutationWrapResult } from "#src/utils/convex_backend/authMutationWrapResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

export type MeetingOrgAddMutationValidatorType = typeof resourceFileAddValidator.type

export const resourceFileAddFields = {
  resourceId: v.string(),
  fileId: v.string(),
} as const

export const resourceFileAddValidator = v.object(resourceFileAddFields)

export const resourceFileAddMutation = mutation({
  args: createTokenValidator(resourceFileAddFields),
  handler: async (ctx, args) => authMutationWrapResult(ctx, args, resourceFileAddMutationFn),
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
