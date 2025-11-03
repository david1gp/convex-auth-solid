import { orgGetByHandle } from "@/org/org_convex/orgGetByHandle"
import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrg } from "./IdOrg"

export const orgGetFields = {
  orgHandle: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type OrgGetValidatorType = typeof orgGetValidator.type
export const orgGetValidator = v.object(orgGetFields)

export async function orgGetFn(ctx: QueryCtx, args: OrgGetValidatorType): PromiseResult<DocOrg | null> {
  const op = "orgGetFn"
  const org = await orgGetByHandle(ctx, args.orgHandle)
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }
  if (args.updatedAt && args.updatedAt === org.updatedAt) {
    return createResult(null)
  }
  return createResult(org)
}
