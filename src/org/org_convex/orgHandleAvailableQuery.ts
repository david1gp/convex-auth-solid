import { orgGetByHandleFn } from "@/org/org_convex/orgGetByHandleFn"
import { query, type QueryCtx } from "@convex/_generated/server"
import { authQueryR } from "@/utils/convex_backend/authQueryR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const orgHandleAvailableFields = {
  orgHandle: v.string(),
} as const

export type OrgHandleAvailableValidatorType = typeof orgHandleAvailableValidator.type
export const orgHandleAvailableValidator = v.object(orgHandleAvailableFields)

export const orgHandleAvailableQuery = query({
  args: createTokenValidator(orgHandleAvailableFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgHandleAvailableQueryFn),
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
