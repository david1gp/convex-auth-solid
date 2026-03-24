import { query, type QueryCtx } from "#convex/_generated/server.js"
import { createResult, type PromiseResult } from "#result"
import { orgGetByHandleFn } from "#src/org/org_convex/orgGetByHandleFn.js"
import { authQueryResult } from "#src/utils/convex_backend/authQueryResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { v } from "convex/values"

export const orgHandleAvailableFields = {
  orgHandle: v.string(),
} as const

export type OrgHandleAvailableValidatorType = typeof orgHandleAvailableValidator.type
export const orgHandleAvailableValidator = v.object(orgHandleAvailableFields)

export const orgHandleAvailableQuery = query({
  args: createTokenValidator(orgHandleAvailableFields),
  handler: async (ctx, args) => authQueryResult(ctx, args, orgHandleAvailableQueryFn),
})

export async function orgHandleAvailableQueryFn(
  ctx: QueryCtx,
  args: OrgHandleAvailableValidatorType,
): PromiseResult<boolean> {
  const op = "orgHandleAvailableFn"
  const org = await orgGetByHandleFn(ctx, args.orgHandle)

  if (org) {
    return createResult(false)
  }
  return createResult(true)
}
