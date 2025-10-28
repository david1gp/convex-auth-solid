import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { vIdOrgMembers } from "./vIdOrgMembers"

export type OrgMemberDeleteValidatorType = typeof orgMemberDeleteValidator.type

export const orgMemberDeleteFields = {
  orgHandle: v.string(),
  memberId: vIdOrgMembers,
} as const

export const orgMemberDeleteValidator = v.object(orgMemberDeleteFields)

export async function orgMemberDeleteFn(ctx: MutationCtx, args: OrgMemberDeleteValidatorType): PromiseResult<null> {
  const op = "orgMemberDeleteFn"

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const member = await ctx.db.get(args.memberId)
  if (!member || member.orgId !== org._id) {
    return createResult(null) // idempotent
  }

  await ctx.db.delete(args.memberId)
  return createResult(null)
}
