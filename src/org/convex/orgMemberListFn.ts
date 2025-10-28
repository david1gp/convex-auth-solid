import type { DocOrgMember } from "@/org/convex/IdOrg"
import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { vIdOrg } from "./vIdOrg"

export type OrgMembersListValidatorType = typeof orgMembersListValidator.type

export const orgMembersListFields = {
  orgId: vIdOrg,
} as const

export const orgMembersListValidator = v.object(orgMembersListFields)

export async function orgMemberListFn(ctx: QueryCtx, args: OrgMembersListValidatorType): Promise<DocOrgMember[]> {
  return await ctx.db.query("orgMembers").withIndex("orgId", (q) => q.eq("orgId", args.orgId)).collect()
}
