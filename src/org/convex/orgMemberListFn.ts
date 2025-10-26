import type { DocOrgMember } from "@/org/convex/IdOrg"
import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { vIdOrgs } from "./vIdOrgs"

export type OrgMembersListValidatorType = typeof orgMembersListValidator.type

export const orgMembersListFields = {
  orgId: vIdOrgs,
} as const

export const orgMembersListValidator = v.object(orgMembersListFields)

export async function orgMemberListFn(ctx: QueryCtx, args: OrgMembersListValidatorType): Promise<DocOrgMember[]> {
  return await ctx.db.query("orgMembers").withIndex("orgId", (q) => q.eq("orgId", args.orgId)).collect()
}
