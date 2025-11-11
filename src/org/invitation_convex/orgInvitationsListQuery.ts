import { docOrgInvitationToModel } from "@/org/invitation_convex/docOrgInvitationToModel"
import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export const orgInvitationsListFields = {
  orgHandle: v.string(),
  token: v.string(),
} as const

export type OrgInvitationsListValidatorType = typeof orgInvitationsListValidator.type
export const orgInvitationsListValidator = v.object(orgInvitationsListFields)

export const orgInvitationsListQuery = query({
  args: orgInvitationsListValidator,
  handler: orgInvitation10ListFn,
})

export async function orgInvitation10ListFn(
  ctx: QueryCtx,
  args: OrgInvitationsListValidatorType,
): PromiseResult<OrgInvitationModel[]> {
  const op = "orgInvitationsListFn"

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const invitations = await ctx.db
    .query("orgInvitations")
    .filter((q) => q.eq(q.field("orgHandle"), org.orgHandle))
    .collect()

  return createResult(invitations.map(docOrgInvitationToModel))
}
