import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const orgSlugAvailableFields = {
  orgSlug: v.string(),
} as const

export type OrgSlugAvailableValidatorType = typeof orgSlugAvailableValidator.type
export const orgSlugAvailableValidator = v.object(orgSlugAvailableFields)

export async function orgSlugAvailableFn(ctx: QueryCtx, args: OrgSlugAvailableValidatorType): PromiseResult<boolean> {
  const op = "orgSlugAvailableFn"
  const org = await ctx.db
    .query("orgs")
    .withIndex("slug", (q) => q.eq("slug", args.orgSlug))
    .unique()

  if (org) {
    return createResult(false)
  }
  return createResult(true)
}
