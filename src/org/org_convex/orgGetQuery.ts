import { createResult, createResultError, type PromiseResult } from "#result"
import { docOrgToModel } from "#src/org/org_convex/docOrgInvitationToModel.js"
import type { DocOrg } from "#src/org/org_convex/IdOrg.js"
import { orgGetByHandleFn } from "#src/org/org_convex/orgGetByHandleFn.js"
import type { OrgModel } from "#src/org/org_model/OrgModel.js"
import { authQueryResult } from "#src/utils/convex_backend/authQueryResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server.js"
import { v } from "convex/values"

export const orgGetFields = {
  orgHandle: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type OrgGetValidatorType = typeof orgGetValidator.type
export const orgGetValidator = v.object(orgGetFields)

export const orgGetQuery = query({
  args: createTokenValidator(orgGetFields),
  handler: async (ctx, args) => authQueryResult(ctx, args, orgGetQueryFn),
})
export const orgGetInternalQuery = internalQuery({
  args: orgGetValidator,
  handler: orgGetQueryInternalFn,
})

export async function orgGetQueryFn(ctx: QueryCtx, args: OrgGetValidatorType): PromiseResult<OrgModel | null> {
  const op = "orgGetFn"
  const got = await orgGetQueryInternalFn(ctx, args)
  if (!got.success) return got
  if (!got.data) return got
  return createResult(docOrgToModel(got.data))
}

export async function orgGetQueryInternalFn(ctx: QueryCtx, args: OrgGetValidatorType): PromiseResult<DocOrg | null> {
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
