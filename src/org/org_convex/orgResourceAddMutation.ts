import { v } from "convex/values"
import * as a from "valibot"
import { internalMutation, type MutationCtx, mutation } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { orgGetByHandleFn } from "#src/org/org_convex/orgGetByHandleFn.ts"
import { vIdOrg } from "#src/org/org_convex/vIdOrg.ts"
import { resourceGetDocFn } from "#src/resource/convex/resourceGetQuery.ts"
import { resourceSearchProjection } from "#src/resource/convex/resourceSearchProjection.ts"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { nowIso } from "#utils/date/nowIso.js"

export type OrgResourceAddMutationValidatorType = typeof orgResourceAddValidator.type

export const orgResourceAddFields = {
  orgId: v.optional(vIdOrg),
  ...valibotToConvex({ orgHandle: a.string(), resourceId: a.string() }),
} as const

export const orgResourceAddValidator = v.object(orgResourceAddFields)

export const orgResourceAddMutation = mutation({
  args: createTokenValidator(orgResourceAddFields),
  handler: async (ctx, args) => authMutationResult(ctx, args, orgResourceAddMutationFn),
})

export const orgResourceAddInternalMutation = internalMutation({
  args: orgResourceAddValidator,
  handler: orgResourceAddMutationFn,
})

export async function orgResourceAddMutationFn(
  ctx: MutationCtx,
  args: OrgResourceAddMutationValidatorType,
): PromiseResult<null> {
  const op = "orgResourceAddMutationFn"
  const org = args.orgId ? await ctx.db.get("orgs", args.orgId) : await orgGetByHandleFn(ctx, args.orgHandle)
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }
  const resource = await resourceGetDocFn(ctx, args.resourceId)
  if (!resource) {
    return createResultError(op, "Resource not found", args.resourceId)
  }
  await ctx.db.insert("orgResources", {
    orgId: org._id,
    orgHandle: org.orgHandle,
    resourceId: args.resourceId,
    ...resourceSearchProjection(resource),
    createdAt: nowIso(),
  })
  return createResult(null)
}
