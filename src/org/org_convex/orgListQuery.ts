import type { DocOrg } from "@/org/org_convex/IdOrg"
import { query, type QueryCtx } from "@convex/_generated/server"
import { authQueryR } from "@convex/utils/authQueryR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

export type OrgListValidatorType = typeof orgListValidator.type

export const orgListFields = {} as const

export const orgListValidator = v.object(orgListFields)

export const orgListQuery = query({
  args: createTokenValidator(orgListFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgListQueryFn),
})

export async function orgListQueryFn(ctx: QueryCtx, args: OrgListValidatorType): PromiseResult<DocOrg[]> {
  const result = await ctx.db.query("orgs").collect()
  return createResult(result)
}
