import { orgRoleValidator } from "@/org/model/orgRoleValidator"
import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrgMember } from "./IdOrg"
import { vIdOrgMembers } from "./vIdOrgMembers"

export type OrgMemberEditValidatorType = typeof orgMemberEditValidator.type

export const orgMemberEditFields = {
  orgHandle: v.string(),
  memberId: vIdOrgMembers,
  // data
  role: v.optional(orgRoleValidator),
} as const

export const orgMemberEditValidator = v.object(orgMemberEditFields)

export async function orgMemberEditFn(ctx: MutationCtx, args: OrgMemberEditValidatorType): PromiseResult<null> {
  const op = "orgMemberEditFn"

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const member = await ctx.db.get(args.memberId)
  if (!member || member.orgId !== org._id) {
    return createResultError(op, "Org member not found", args.memberId)
  }
  const { orgHandle, memberId, ...partial } = args
  const patch: Partial<DocOrgMember> = partial
  patch.updatedAt = nowIso()

  await ctx.db.patch(args.memberId, patch)
  return createResult(null)
}
