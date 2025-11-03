import { orgGetByHandle } from "@/org/org_convex/orgGetByHandle"
import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export type OrgDeleteValidatorType = typeof orgDeleteValidator.type

export const orgDeleteFields = {
  orgHandle: v.string(),
} as const

export const orgDeleteValidator = v.object(orgDeleteFields)

export async function orgDeleteFn(ctx: MutationCtx, args: OrgDeleteValidatorType): Promise<null> {
  const org = await orgGetByHandle(ctx, args.orgHandle)
  if (!org) return null // idempotent
  const orgId = org._id

  // Delete all members of the org
  const members = await ctx.db
    .query("orgMembers")
    .withIndex("orgId", (q) => q.eq("orgId", orgId))
    .collect()
  await Promise.all(members.map((member) => ctx.db.delete(member._id)))
  // Delete org
  await ctx.db.delete(orgId)
  return null
}
