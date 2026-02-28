import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"
import { docOrgInvitationToModel } from "@/org/invitation_convex/docOrgInvitationToModel"
import { type DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { docOrgMemberToModel } from "@/org/member_convex/docOrgMemberToModel"
import type { OrgMemberProfile } from "@/org/member_model/OrgMemberProfile"
import { docOrgToModel } from "@/org/org_convex/docOrgInvitationToModel"
import type { DocOrg } from "@/org/org_convex/IdOrg"
import { orgGetByHandleFn } from "@/org/org_convex/orgGetByHandleFn"
import type { OrgViewPageType } from "@/org/org_model/OrgViewPageType"
import { authQueryR } from "@/utils/convex_backend/authQueryR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export const orgGetPageFields = {
  orgHandle: v.string(),
} as const

export type OrgGetPageValidatorType = typeof orgGetPageValidator.type
export const orgGetPageValidator = v.object(orgGetPageFields)

export const orgGetPageQuery = query({
  args: createTokenValidator(orgGetPageFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgGetPageQueryFn),
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
