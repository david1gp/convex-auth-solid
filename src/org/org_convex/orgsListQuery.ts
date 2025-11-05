import type { DocOrg } from "@/org/org_convex/IdOrg"
import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { query } from "@convex/_generated/server"
import { authQueryR } from "@convex/utils/authQueryR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgsListValidatorType = typeof orgsListValidator.type

export const orgsListFields = {} as const

export const orgsListValidator = v.object(orgsListFields)

export const orgsListQuery = query({
  args: createTokenValidator(orgsListFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgsListQueryFn),
})

export async function orgsListQueryFn(ctx: QueryCtx, args: OrgsListValidatorType): PromiseResult<DocOrg[]> {
  const result = await ctx.db.query("orgs").collect()
  return createResult(result)
}