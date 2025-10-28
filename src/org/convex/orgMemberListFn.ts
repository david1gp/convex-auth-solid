import type { DocOrgMember } from "@/org/convex/IdOrg"
import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgMembersListValidatorType = typeof orgMembersListValidator.type

export const orgMembersListFields = {
  orgHandle: v.string(),
} as const

export const orgMembersListValidator = v.object(orgMembersListFields)

export async function orgMemberListFn(ctx: QueryCtx, args: OrgMembersListValidatorType): PromiseResult<DocOrgMember[]> {
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

  return createResult(members)
}
