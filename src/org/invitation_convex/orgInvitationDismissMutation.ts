import { mutation, type MutationCtx } from "@convex/_generated/server"
import { authMutationR } from "@convex/utils/authMutationR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgInvitationDismissValidatorType = typeof orgInvitationDismissValidator.type

export const orgInvitationDismissFields = {
  invitationCode: v.string(),
} as const

export const orgInvitationDismissValidator = v.object(orgInvitationDismissFields)

export const orgInvitationDismissMutation = mutation({
  args: createTokenValidator(orgInvitationDismissFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgInvitation60DismissMutationFn),
})

export async function orgInvitation60DismissMutationFn(
  ctx: MutationCtx,
  args: OrgInvitationDismissValidatorType,
): PromiseResult<null> {
  const op = "orgInvitationDismissFn"

  const invitation = await ctx.db
    .query("orgInvitations")
    .withIndex("invitationCode", (q) => q.eq("invitationCode", args.invitationCode))
    .unique()
  if (!invitation) {
    return createResultError(op, "Invitation not found", args.invitationCode)
  }

  await ctx.db.delete(invitation._id)

  return createResult(null)
}
