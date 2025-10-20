import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import { createUserSessionTimes, type UserSession } from "~auth/model/UserSession"
import {
    commonAuthProviderValidator,
    type CommonAuthProvider,
} from "~auth/server/social_identity_providers/CommonAuthProvider"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocAuthAccount } from "../IdUser"
import { createUserFromAuthProviderFn } from "./createUserFromAuthProvider"
import { dbUsersToUserProfile } from "./dbUsersToUserProfile"
import { findUserByEmailFn } from "./findUserByEmailQuery"
import { linkAuthToExistingUserFn } from "./linkAuthToExistingUserMutation"

export type SignInUsingSocialAuthResultInternal = Omit<UserSession, "token">

export const findOrCreateUserMutation = internalMutation({
  args: commonAuthProviderValidator,
  handler: async (ctx, args) => {
    return findOrCreateUserFn(ctx, args)
  },
})

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
    const userProfile = dbUsersToUserProfile(user)
    return createResult({ user: userProfile, signedInMethod: authData.provider, ...createUserSessionTimes() })
  }

  // Check for existing user by email
  if (authData.email) {
    // const existingUser = await ctx.runQuery(internal.auth.findUserByEmailQuery, { email })
    const existingUser = await findUserByEmailFn(ctx, authData.email)
    if (existingUser) {
      // await ctx.runMutation(internal.auth.linkAuthToExistingUserMutation, {
      //   userId: existingUser._id,
      //   provider: authData.provider,
      //   providerId: authData.providerId,
      // })
      await linkAuthToExistingUserFn(ctx, existingUser._id, authData.provider, authData.providerId)
      const userProfile = dbUsersToUserProfile(existingUser)
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
