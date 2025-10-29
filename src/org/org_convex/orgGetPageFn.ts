import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrgInvitation } from "../invitation_convex/IdOrgInvitation"
import type { DocOrgMember } from "../member_convex/IdOrgMember"
import type { DocOrg } from "./IdOrg"

export const orgGetPageFields = {
  orgHandle: v.string(),
} as const

export type OrgGetPageValidatorType = typeof orgGetPageValidator.type
export const orgGetPageValidator = v.object(orgGetPageFields)

export async function orgGetPageFn(
  ctx: QueryCtx,
  args: OrgGetPageValidatorType,
): PromiseResult<{
  org: DocOrg
  orgMembers: DocOrgMember[]
  orgInvitations: DocOrgInvitation[]
}> {
  const op = "orgGetPageFn"

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const orgMembers = await ctx.db
    .query("orgMembers")
    .withIndex("orgId", (q) => q.eq("orgId", org._id))
    .collect()

  const orgInvitations = await ctx.db
    .query("orgInvitations")
    .filter((q) => q.eq(q.field("orgId"), org._id))
    .collect()

  return createResult({
    org,
    orgMembers,
    orgInvitations,
  })
}
