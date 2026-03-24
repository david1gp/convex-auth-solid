import { mutation, type MutationCtx } from "#convex/_generated/server.js"
import { orgGetByHandleFn } from "#src/org/org_convex/orgGetByHandleFn.js"
import { authMutationWrapResult } from "#src/utils/convex_backend/authMutationWrapResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { v } from "convex/values"

export type OrgDeleteValidatorType = typeof orgDeleteValidator.type

export const orgDeleteFields = {
  orgHandle: v.string(),
} as const

export const orgDeleteValidator = v.object(orgDeleteFields)

export const orgDeleteMutation = mutation({
  args: createTokenValidator(orgDeleteFields),
  handler: async (ctx, args) => authMutationWrapResult(ctx, args, orgDeleteMutationFn),
})

export async function orgDeleteMutationFn(ctx: MutationCtx, args: OrgDeleteValidatorType): Promise<null> {
  const org = await orgGetByHandleFn(ctx, args.orgHandle)
  if (!org) return null // idempotent
  const orgId = org._id

  // Delete all members of the org
  const members = await ctx.db
    .query("orgMembers")
    .withIndex("orgId", (q) => q.eq("orgId", orgId))
    .collect()
  await Promise.all(members.map((member) => ctx.db.delete("orgMembers", member._id)))
  // Delete org
  await ctx.db.delete("orgs", orgId)
  return null
}
