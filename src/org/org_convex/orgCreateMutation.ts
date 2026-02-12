import type { IdOrg } from "@/org/org_convex/IdOrg"
import { orgHandleAvailableQueryFn } from "@/org/org_convex/orgHandleAvailableQuery"
import { orgDataFields } from "@/org/org_convex/orgTables"
import { orgDataSchemaFields } from "@/org/org_model/orgSchema"
import { mutation, type MutationCtx } from "@convex/_generated/server"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { v } from "convex/values"
import * as va from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export type OrgCreateValidatorType = typeof orgCreateValidator.type

export const orgCreateFields = orgDataFields

export const orgCreateValidator = v.object(orgCreateFields)

export const orgCreateMutation = mutation({
  args: createTokenValidator(orgCreateFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgCreateMutationFn),
})

export async function orgCreateMutationFn(ctx: MutationCtx, args: OrgCreateValidatorType): PromiseResult<IdOrg> {
  const op = "orgCreateFn"
  const now = nowIso()

  const schema = va.object(orgDataSchemaFields)
  const parse = va.safeParse(schema, args)
  if (!parse.success) {
    return createError(op, va.summarize(parse.issues))
  }

  const handleAvailableResult = await orgHandleAvailableQueryFn(ctx, { orgHandle: args.orgHandle })
  if (!handleAvailableResult.success) return handleAvailableResult
  if (!handleAvailableResult.data) {
    const errorMessage = "Handle not available, please try a different one"
    return createError(op, errorMessage, args.orgHandle)
  }

  const orgId = await ctx.db.insert("orgs", {
    ...args,
    createdAt: now,
    updatedAt: now,
  })
  return createResult(orgId)
}
