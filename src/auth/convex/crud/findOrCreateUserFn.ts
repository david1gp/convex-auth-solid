import { createUserSessionTimes, type UserSession } from "@/auth/model/UserSession"
import { type CommonAuthProvider } from "@/auth/server/social_identity_providers/CommonAuthProvider"
import { orgMemberGetHandleAndRoleFn } from "@/org/member_convex/orgMemberGetHandleAndRoleInternalQuery"
import { type MutationCtx } from "@convex/_generated/server"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocAuthAccount } from "../IdUser"
import { createUserFromAuthProviderFn } from "./createUserFromAuthProviderMutation"
import { dbUsersToUserProfile } from "./dbUsersToUserProfile"
import { findUserByEmailFn } from "./findUserByEmailQuery"
import { linkAuthToExistingUserFn } from "./linkAuthToExistingUserFn"

export type SignInUsingSocialAuthResultInternal = Omit<UserSession, "token">

export async function findOrCreateUserFn(
  ctx: MutationCtx,
  authData: CommonAuthProvider,
): PromiseResult<SignInUsingSocialAuthResultInternal> {
  const op = "findOrCreateUser"

  // Check for existing auth account
  const existingAuthAccount: DocAuthAccount | null = await ctx.db
    .query("authAccounts")
    .withIndex("providerAndAccountId", (q) =>
      q.eq("provider", authData.provider).eq("providerAccountId", authData.providerId),
    )
    .unique()
  if (existingAuthAccount) {
    const user = await ctx.db.get(existingAuthAccount.userId)
    if (!user) return createResultError(op, "User not found by userId", existingAuthAccount.userId)
    const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, user._id)
    const userProfile = dbUsersToUserProfile(user, orgHandle, orgRole)
    return createResult({ user: userProfile, signedInMethod: authData.provider, ...createUserSessionTimes() })
  }

  // Check for existing user by email
  if (authData.email) {
    const existingUser = await findUserByEmailFn(ctx, authData.email)
    if (existingUser) {
      await linkAuthToExistingUserFn(ctx, existingUser._id, authData.provider, authData.providerId)
      const { orgHandle, orgRole } = await orgMemberGetHandleAndRoleFn(ctx, existingUser._id)
      const userProfile = dbUsersToUserProfile(existingUser, orgHandle, orgRole)
      return createResult({
        user: userProfile,
        signedInMethod: authData.provider,
        ...createUserSessionTimes(),
      })
    }
  }

  // No existing user found - create new one
  const createdResult = await createUserFromAuthProviderFn(ctx, authData)
  if (!createdResult.success) {
    return createResultError(op, "Failed to create user: " + createdResult.errorMessage)
  }
  const userSession: SignInUsingSocialAuthResultInternal = {
    user: createdResult.data,
    signedInMethod: authData.provider,
    ...createUserSessionTimes(),
  }
  return createResult(userSession)
}
