import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrgMember } from "./IdOrg"
import { vIdOrgMembers } from "./vIdOrgMembers"

export const orgMemberGetFields = {
  memberId: vIdOrgMembers,
  updatedAt: v.optional(v.string()),
} as const

export type OrgMemberGetValidatorType = typeof orgMemberGetValidator.type
export const orgMemberGetValidator = v.object(orgMemberGetFields)

export async function orgMemberGetFn(ctx: QueryCtx, args: OrgMemberGetValidatorType): PromiseResult<DocOrgMember | null> {
  const op = "orgMemberGetFn"
  let member = await ctx.db.get(args.memberId)
  if (!member) {
    return createResultError(op, "Org member not found", args.memberId)
  }
  if (args.updatedAt && args.updatedAt === member.updatedAt) {
    return createResult(null)
  }
  return createResult(member)
}