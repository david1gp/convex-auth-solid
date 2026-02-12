import { orgRoleValidator } from "@/org/org_model_field/orgRoleValidator"
import { mutation, type MutationCtx } from "@convex/_generated/server"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrgMember, IdOrgMember } from "./IdOrgMember"

export type OrgMemberEditValidatorType = typeof orgMemberEditValidator.type

export const orgMemberEditValidator = v.object({
  memberId: v.string(),
  orgHandle: v.string(),
  // data
  role: v.optional(orgRoleValidator),
}).partial()

export const orgMemberEditMutation = mutation({
  args: createTokenValidator(orgMemberEditValidator.fields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgMemberEditFn),
})

export async function orgMemberEditFn(ctx: MutationCtx, args: OrgMemberEditValidatorType): PromiseResult<null> {
  const op = "orgMemberEditFn"
  const { orgHandle, memberId, ...partial } = args

  if (!orgHandle || !memberId) {
    return createResultError(op, "Missing orgHandle or memberId")
  }

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", orgHandle)
  }

  const member = await ctx.db.get(memberId as IdOrgMember)
  if (!member || member.orgId !== org._id) {
    return createResultError(op, "Org member not found", memberId)
  }
  const patch: Partial<DocOrgMember> = partial
  patch.updatedAt = nowIso()

  await ctx.db.patch(memberId as IdOrgMember, patch)
  return createResult(null)
}
