import type { IdOrgMember } from "@/org/convex/IdOrg"
import { orgMemberDataFields } from "@/org/convex/orgTables"
import type { MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"

export type OrgMemberCreateValidatorType = typeof orgMemberCreateValidator.type

export const orgMemberCreateFields = orgMemberDataFields

export const orgMemberCreateValidator = v.object(orgMemberCreateFields)

export async function orgMemberCreateFn(ctx: MutationCtx, args: OrgMemberCreateValidatorType): Promise<IdOrgMember> {
  const now = nowIso()
  const orgMemberId = await ctx.db.insert("orgMembers", {
    ...args,
    joinedAt: now,
    updatedAt: now,
  })
  return orgMemberId
}
