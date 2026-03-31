import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { orgGetByHandleFn } from "#src/org/org_convex/orgGetByHandleFn.ts"
import { vIdOrg } from "#src/org/org_convex/vIdOrg.ts"
import { authMutationResult } from "#src/utils/convex_backend/authMutationResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

export type OrgResourceAddMutationValidatorType = typeof orgResourceAddValidator.type

export const orgResourceAddFields = {
  orgId: v.optional(vIdOrg),
  orgHandle: v.string(),
  resourceId: v.string(),
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
  await ctx.db.insert("orgResources", {
    orgId: org._id,
    orgHandle: org.orgHandle,
    resourceId: args.resourceId,
    createdAt: nowIso(),
  })
  return createResult(null)
}
