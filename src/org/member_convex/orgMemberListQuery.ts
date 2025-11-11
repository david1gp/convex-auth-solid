import { docOrgMemberToModel } from "@/org/member_convex/docOrgMemberToModel"
import type { OrgMemberModel } from "@/org/member_model/OrgMemberModel"
import { query, type QueryCtx } from "@convex/_generated/server"
import { authQueryR } from "@convex/utils/authQueryR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgMembersListValidatorType = typeof orgMembersListValidator.type

export const orgMembersListFields = {
  orgHandle: v.string(),
} as const

export const orgMembersListValidator = v.object(orgMembersListFields)

export const orgMembersListQuery = query({
  args: createTokenValidator(orgMembersListFields),
  handler: async (ctx, args) => await authQueryR(ctx, args, orgMemberListFn),
})

export async function orgMemberListFn(
  ctx: QueryCtx,
  args: OrgMembersListValidatorType,
): PromiseResult<OrgMemberModel[]> {
  const op = "orgMemberListFn"

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const members = await ctx.db
    .query("orgMembers")
    .withIndex("orgId", (q) => q.eq("orgId", org._id))
    .collect()

  return createResult(members.map(docOrgMemberToModel))
}
