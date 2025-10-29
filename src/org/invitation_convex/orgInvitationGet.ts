import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrg } from "../org_convex/IdOrg"

export const orgInvitationGetFields = {
  orgHandle: v.string(),
  invitationCode: v.string(),
} as const

export type OrgInvitationGetValidatorType = typeof orgInvitationGetValidator.type
export const orgInvitationGetValidator = v.object(orgInvitationGetFields)

export async function orgInvitationGetFn(
  ctx: QueryCtx,
  args: OrgInvitationGetValidatorType,
): PromiseResult<DocOrg | null> {
  const op = "orgInvitationGetFn"

  if (!args.invitationCode) {
    return createResultError(op, "Missing invitation code", args.invitationCode)
  }

  // Find invitation by code
  const invitation = await ctx.db
    .query("orgInvitations")
    .withIndex("invitationCode", (q) => q.eq("invitationCode", args.invitationCode))
    .unique()

  if (!invitation) {
    return createResultError(op, "Invalid invitation code", args.invitationCode)
  }

  // Verify orgHandle matches
  if (invitation.acceptedAt) {
    return createResultError(op, "Invitation already accepted", args.invitationCode)
  }

  const org = await ctx.db.get(invitation.orgId)
  if (!org) {
    return createResultError(op, "Organization not found", invitation.orgId)
  }

  if (org.orgHandle !== args.orgHandle) {
    return createResultError(op, "Organization handle mismatch", args.orgHandle)
  }

  return createResult(org)
}
