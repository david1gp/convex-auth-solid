import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrg } from "./IdOrg"

export const orgGetFields = {
  handle: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type OrgGetValidatorType = typeof orgGetValidator.type
export const orgGetValidator = v.object(orgGetFields)

export async function orgGetFn(ctx: QueryCtx, args: OrgGetValidatorType): PromiseResult<DocOrg | null> {
  const op = "orgGetFn"
  const org = await ctx.db
    .query("orgs")
    .withIndex("handle", (q) => q.eq("handle", args.handle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.handle)
  }
  if (args.updatedAt && args.updatedAt === org.updatedAt) {
    return createResult(null)
  }
  return createResult(org)
}
