import { createResult, createResultError, type PromiseResult } from "#result"
import { docOrgInvitationToModel } from "#src/org/invitation_convex/docOrgInvitationToModel.js"
import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.js"
import { query, type QueryCtx } from "@convex/_generated/server.js"
import { v } from "convex/values"

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
