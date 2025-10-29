import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const orgHandleAvailableFields = {
  orgHandle: v.string(),
} as const

export type OrgHandleAvailableValidatorType = typeof orgHandleAvailableValidator.type
export const orgHandleAvailableValidator = v.object(orgHandleAvailableFields)

export async function orgHandleAvailableFn(
  ctx: QueryCtx,
  args: OrgHandleAvailableValidatorType,
): PromiseResult<boolean> {
  const op = "orgHandleAvailableFn"
  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()

  if (org) {
    return createResult(false)
  }
  return createResult(true)
}
