import { orgGetByHandleFn } from "@/org/org_convex/orgGetByHandleFn"
import { vIdOrg } from "@/org/org_convex/vIdOrg"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export type OrgResourceRemoveMutationValidatorType = typeof orgResourceRemoveValidator.type

export const orgResourceRemoveFields = {
  orgId: v.optional(vIdOrg),
  orgHandle: v.string(),
  resourceId: v.string(),
} as const

export const orgResourceRemoveValidator = v.object(orgResourceRemoveFields)

export const orgResourceRemoveMutation = mutation({
  args: createTokenValidator(orgResourceRemoveFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgResourceRemoveMutationFn),
})

export const orgResourceRemoveInternalMutation = internalMutation({
  args: orgResourceRemoveValidator,
  handler: orgResourceRemoveMutationFn,
})

export async function orgResourceRemoveMutationFn(
  ctx: MutationCtx,
  args: OrgResourceRemoveMutationValidatorType,
): PromiseResult<null> {
  const op = "orgResourceRemoveMutationFn"
  const org = args.orgId ? await ctx.db.get("orgs", args.orgId) : await orgGetByHandleFn(ctx, args.orgHandle)
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }
  const list = await ctx.db
    .query("orgResources")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .filter((q) => q.eq(q.field("resourceId"), args.resourceId))
    .collect()
  await Promise.all(list.map((e) => ctx.db.delete("orgResources", e._id)))
  return createResult(null)
}
