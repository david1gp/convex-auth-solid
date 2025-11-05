import { dbUsersToUserProfile } from "@/auth/convex/crud/dbUsersToUserProfile"
import { orgGetByHandleFn } from "@/org/org_convex/orgGetByHandleFn"
import type { OrgViewPageType } from "@/org/org_model/OrgViewPageType"
import { query, type QueryCtx } from "@convex/_generated/server"
import { authQueryR } from "@convex/utils/authQueryR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { OrgMemberProfile } from "../member_model/OrgMemberProfile"

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

  const org = await orgGetByHandleFn(ctx, args.orgHandle)
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const orgMembers = await ctx.db
    .query("orgMembers")
    .withIndex("orgId", (q) => q.eq("orgId", org._id))
    .collect()

  const members: OrgMemberProfile[] = await Promise.all(
    orgMembers.map(async (member) => {
      const user = await ctx.db.get(member.userId)
      if (!user) {
        throw new Error(`User not found for member ${member._id}`)
      }
      const profile = dbUsersToUserProfile(user, org.orgHandle, member.role)
      return { ...member, profile }
    }),
  )

  const invitations = await ctx.db
    .query("orgInvitations")
    .filter((q) => q.eq(q.field("orgHandle"), org.orgHandle))
    .collect()

  return createResult({
    org,
    members,
    invitations,
  })
}
