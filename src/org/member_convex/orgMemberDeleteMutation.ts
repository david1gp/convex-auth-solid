import type { IdOrgMember } from "@/org/member_convex/IdOrgMember"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgMemberDeleteValidatorType = typeof orgMemberDeleteValidator.type

export const orgMemberDeleteFields = {
  memberId: v.string(),
  orgHandle: v.string(),
} as const

export const orgMemberDeleteValidator = v.object(orgMemberDeleteFields)

export const orgMemberDeleteMutation = mutation({
  args: createTokenValidator(orgMemberDeleteFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgMemberDeleteFn),
})

export async function orgMemberDeleteFn(ctx: MutationCtx, args: OrgMemberDeleteValidatorType): PromiseResult<null> {
  const op = "orgMemberDeleteFn"

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const member = await ctx.db.get("orgMembers", args.memberId as IdOrgMember)
  if (!member || member.orgId !== org._id) {
    return createResult(null) // idempotent
  }

  await ctx.db.delete("orgMembers", args.memberId as IdOrgMember)
  return createResult(null)
}
