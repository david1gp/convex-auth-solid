import type { DocUser, IdUser } from "@/auth/convex/IdUser"
import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"
import type { UserProfile } from "@/auth/model/UserProfile"
import { orgMemberGetHandleAndRoleFn } from "@/org/member_convex/orgMemberGetHandleAndRoleInternalQuery"
import type { OrgRole } from "@/org/org_model_field/orgRole"
import { type MutationCtx, internalMutation } from "@convex/_generated/server"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { vIdUser } from "@/auth/convex/vIdUser"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { type PromiseResult, createResult } from "~utils/result/Result"

export const userProfileFieldsBase = {
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  bio: v.optional(v.string()),
  url: v.optional(v.string()),
}

export const userProfileFieldsValidatorInternal = v.object({ ...userProfileFieldsBase, userId: vIdUser })
export type UserProfileFieldsTypeInternal = typeof userProfileFieldsValidatorInternal.type

export const userProfileUpdateInternalMutation = internalMutation({
  args: userProfileFieldsValidatorInternal,
  handler: async (ctx, args) => userProfileUpdateInternalFn(ctx, args),
})

async function userProfileUpdateInternalFn(
  ctx: MutationCtx,
  args: UserProfileFieldsTypeInternal,
): PromiseResult<UserProfile> {
  const op = "userProfileUpdateInternalFn"

  const userId = args.userId as IdUser
  const currentUser: DocUser | null = await ctx.db.get(userId)
  if (!currentUser) {
    return createErrorAndLogError(op, "User not found")
  }

  const nameChanged = args.name !== undefined && args.name !== currentUser.name
  const imageChanged = args.image !== undefined && args.image !== currentUser.image
  const bioChanged = args.bio !== undefined && args.bio !== currentUser.bio
  const urlChanged = args.url !== undefined && args.url !== currentUser.url

  if (!nameChanged && !imageChanged && !bioChanged && !urlChanged) {
    const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)
    return createResult(docUserToUserProfile(currentUser, orgHandle, orgRole))
  }

  await ctx.db.patch(userId, {
    ...(nameChanged && { name: args.name }),
    ...(imageChanged && { image: args.image }),
    ...(bioChanged && { bio: args.bio }),
    ...(urlChanged && { url: args.url }),
    updatedAt: nowIso(),
  })

  const updatedUser = await ctx.db.get(userId)
  if (!updatedUser) {
    return createErrorAndLogError(op, "User not found after update")
  }

  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)
  return createResult(docUserToUserProfile(updatedUser, orgHandle, orgRole))
}
