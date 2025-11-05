import { orgGetByHandleFn } from "@/org/org_convex/orgGetByHandleFn"
import { query, type QueryCtx } from "@convex/_generated/server"
import { authQueryR } from "@convex/utils/authQueryR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrg } from "./IdOrg"

export const orgGetFields = {
  orgHandle: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type OrgGetValidatorType = typeof orgGetValidator.type
export const orgGetValidator = v.object(orgGetFields)

export const orgGetQuery = query({
  args: createTokenValidator(orgGetFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgGetQueryFn),
})

export async function orgGetQueryFn(ctx: QueryCtx, args: OrgGetValidatorType): PromiseResult<DocOrg | null> {
  const op = "orgGetFn"
  const org = await orgGetByHandleFn(ctx, args.orgHandle)
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }
  if (args.updatedAt && args.updatedAt === org.updatedAt) {
    return createResult(null)
  }
  return createResult(org)
}
