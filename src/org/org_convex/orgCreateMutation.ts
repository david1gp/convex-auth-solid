import { mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createError, createResult, type PromiseResult } from "#result"
import type { IdOrg } from "#src/org/org_convex/IdOrg.js"
import { orgHandleAvailableQueryFn } from "#src/org/org_convex/orgHandleAvailableQuery.js"
import { orgDataSchemaFields } from "#src/org/org_model/orgSchema.js"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.js"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"
import * as a from "valibot"

export type OrgCreateValidatorType = typeof orgCreateValidator.type

export const orgCreateFields = valibotToConvex(orgDataSchemaFields)

export const orgCreateValidator = v.object(orgCreateFields)

export const orgCreateMutation = mutation({
  args: createTokenValidator(orgCreateFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, orgCreateMutationFn),
})

export async function orgCreateMutationFn(ctx: MutationCtx, args: OrgCreateValidatorType): PromiseResult<IdOrg> {
  const op = "orgCreateFn"
  const now = nowIso()

  const schema = a.object(orgDataSchemaFields)
  const parse = a.safeParse(schema, args)
  if (!parse.success) {
    return createError(op, a.summarize(parse.issues))
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
