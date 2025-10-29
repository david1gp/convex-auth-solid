import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { vIdOrg } from "./vIdOrg"

export type OrgDeleteValidatorType = typeof orgDeleteValidator.type

export const orgDeleteFields = {
  orgId: vIdOrg,
} as const

export const orgDeleteValidator = v.object(orgDeleteFields)

export async function orgDeleteFn(ctx: MutationCtx, args: OrgDeleteValidatorType): Promise<null> {
  const org = await ctx.db.get(args.orgId)
  if (!org) return null // idempotent

  // Delete all members of the org
  const members = await ctx.db
    .query("orgMembers")
    .withIndex("orgId", (q) => q.eq("orgId", args.orgId))
    .collect()
  await Promise.all(members.map((member) => ctx.db.delete(member._id)))
  // Delete org
  await ctx.db.delete(args.orgId)
  return null
}
