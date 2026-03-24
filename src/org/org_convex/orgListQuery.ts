import { query, type QueryCtx } from "#convex/_generated/server.js"
import { createResult, type PromiseResult } from "#result"
import type { DocOrg } from "#src/org/org_convex/IdOrg.js"
import { authQueryResult } from "#src/utils/convex_backend/authQueryResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { v } from "convex/values"

export type OrgListValidatorType = typeof orgListValidator.type

export const orgListFields = {} as const

export const orgListValidator = v.object(orgListFields)

export const orgListQuery = query({
  args: createTokenValidator(orgListFields),
  handler: async (ctx, args) => authQueryResult(ctx, args, orgListQueryFn),
})

export async function orgListQueryFn(ctx: QueryCtx, args: OrgListValidatorType): PromiseResult<DocOrg[]> {
  const result = await ctx.db.query("orgs").collect()
  return createResult(result)
}
