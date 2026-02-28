import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

export type OrgCleanupIfEmptyValidatorType = typeof orgCleanupIfEmptyValidator.type

export const orgCleanupIfEmptyFields = {
  orgHandle: v.string(),
} as const

export const orgCleanupIfEmptyValidator = v.object(orgCleanupIfEmptyFields)

export const orgCleanupIfEmptyInternalMutation = internalMutation({
  args: orgCleanupIfEmptyValidator,
  handler: orgCleanupIfEmptyFn,
})

export async function orgCleanupIfEmptyFn(ctx: MutationCtx, args: OrgCleanupIfEmptyValidatorType): PromiseResult<null> {
  const op = "orgCleanupIfEmptyFn"

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResult(null)
  }

  const members = await ctx.db
    .query("orgMembers")
    .withIndex("orgId", (q) => q.eq("orgId", org._id))
    .collect()

  if (members.length > 0) {
    return createResult(null)
  }

  await ctx.db.delete("orgs", org._id)
  return createResult(null)
}
