import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export const orgInvitationGetFields = {
  orgHandle: v.optional(v.string()),
  invitationCode: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type OrgInvitationGetValidatorType = typeof orgInvitationGetValidator.type
export const orgInvitationGetValidator = v.object(orgInvitationGetFields)

export const orgInvitationGetQuery = query({
  args: orgInvitationGetValidator,
  handler: orgInvitation40GetFn,
})

export async function orgInvitation40GetFn(
  ctx: QueryCtx,
  args: OrgInvitationGetValidatorType,
): PromiseResult<DocOrgInvitation | null> {
  const op = "orgInvitationGetFn"

  if (!args.invitationCode) {
    return createResultError(op, "Missing invitation code", args.invitationCode)
  }

  const invitation = await ctx.db
    .query("orgInvitations")
    .withIndex("invitationCode", (q) => q.eq("invitationCode", args.invitationCode))
    .unique()

  if (!invitation) {
    return createResultError(op, "Invalid invitation code", args.invitationCode)
  }
  if (args.updatedAt === invitation.updatedAt) {
    return createResult(null)
  }
  return createResult(invitation)
}
