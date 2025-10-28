import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrgMember } from "./IdOrg"
import { vIdOrgMembers } from "./vIdOrgMembers"

export const orgMemberGetFields = {
  orgHandle: v.string(),
  memberId: vIdOrgMembers,
  updatedAt: v.optional(v.string()),
} as const

export type OrgMemberGetValidatorType = typeof orgMemberGetValidator.type
export const orgMemberGetValidator = v.object(orgMemberGetFields)

export async function orgMemberGetFn(
  ctx: QueryCtx,
  args: OrgMemberGetValidatorType,
): PromiseResult<DocOrgMember | null> {
  const op = "orgMemberGetFn"

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  let member = await ctx.db.get(args.memberId)
  if (!member || member.orgId !== org._id) {
    return createResultError(op, "Org member not found", args.memberId)
  }
  if (args.updatedAt && args.updatedAt === member.updatedAt) {
    return createResult(null)
  }
  return createResult(member)
}
