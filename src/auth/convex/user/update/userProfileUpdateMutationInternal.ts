import { type PromiseResult, createResult } from "#result"
import type { DocUser, IdUser } from "#src/auth/convex/IdUser.js"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.js"
import { vIdUser } from "#src/auth/convex/vIdUser.js"
import type { UserProfile } from "#src/auth/model/UserProfile.js"
import { orgMemberGetHandleAndRoleFn } from "#src/org/member_convex/orgMemberGetHandleAndRoleInternalQuery.js"
import { createErrorAndLogError } from "#src/utils/convex_backend/createErrorAndLogError.js"
import { nowIso } from "#utils/date/nowIso"
import { type MutationCtx, internalMutation } from "@convex/_generated/server.js"
import { v } from "convex/values"

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
  const currentUser: DocUser | null = await ctx.db.get("users", userId)
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

  await ctx.db.patch("users", userId, {
    ...(nameChanged && { name: args.name }),
    ...(imageChanged && { image: args.image }),
    ...(bioChanged && { bio: args.bio }),
    ...(urlChanged && { url: args.url }),
    updatedAt: nowIso(),
  })

  const updatedUser = await ctx.db.get("users", userId)
  if (!updatedUser) {
    return createErrorAndLogError(op, "User not found after update")
  }

  const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, userId)
  return createResult(docUserToUserProfile(updatedUser, orgHandle, orgRole))
}
