import { query, type QueryCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.ts"
import { docOrgInvitationToModel } from "#src/org/invitation_convex/docOrgInvitationToModel.ts"
import { type DocOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.ts"
import { docOrgMemberToModel } from "#src/org/member_convex/docOrgMemberToModel.ts"
import type { OrgMemberProfile } from "#src/org/member_model/OrgMemberProfile.ts"
import { docOrgToModel } from "#src/org/org_convex/docOrgInvitationToModel.ts"
import type { DocOrg } from "#src/org/org_convex/IdOrg.ts"
import { orgGetByHandleFn } from "#src/org/org_convex/orgGetByHandleFn.ts"
import type { OrgViewPageType } from "#src/org/org_model/OrgViewPageType.ts"
import { authQueryResult } from "#src/utils/convex_backend/authQueryResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { v } from "convex/values"

export const orgGetPageFields = {
  orgHandle: v.string(),
} as const

export type OrgGetPageValidatorType = typeof orgGetPageValidator.type
export const orgGetPageValidator = v.object(orgGetPageFields)

export const orgGetPageQuery = query({
  args: createTokenValidator(orgGetPageFields),
  handler: async (ctx, args) => authQueryResult(ctx, args, orgGetPageQueryFn),
})

export async function orgGetPageQueryFn(ctx: QueryCtx, args: OrgGetPageValidatorType): PromiseResult<OrgViewPageType> {
  const op = "orgGetPageFn"

  const org: DocOrg | null = await orgGetByHandleFn(ctx, args.orgHandle)
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const orgMembers = await ctx.db
    .query("orgMembers")
    .withIndex("orgId", (q) => q.eq("orgId", org._id))
    .collect()

  const members: OrgMemberProfile[] = await Promise.all(
    orgMembers.map(async (member) => {
      const user = await ctx.db.get("users", member.userId)
      if (!user) {
        throw new Error(`User not found for member ${member._id}`)
      }
      const m = docOrgMemberToModel(member)
      const profile = docUserToUserProfile(user, org.orgHandle, member.role)
      return { ...m, profile }
    }),
  )

  const orgInvitations: DocOrgInvitation[] = await ctx.db
    .query("orgInvitations")
    .filter((q) => q.eq(q.field("orgHandle"), org.orgHandle))
    .collect()
  const invitations = orgInvitations.map(docOrgInvitationToModel)

  return createResult({
    org: docOrgToModel(org),
    members,
    invitations,
  })
}
