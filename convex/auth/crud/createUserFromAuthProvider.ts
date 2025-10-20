import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import type { WithoutSystemFields } from "convex/server"
import type { UserProfile } from "~auth/model/UserProfile"
import { userRole } from "~auth/model/userRole"
import {
    commonAuthProviderValidator,
    getUserNameFromCommonAuthProvider,
    type CommonAuthProvider,
} from "~auth/server/social_identity_providers/CommonAuthProvider"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocUser } from "../IdUser"

export const createUserFromAuthProvider = internalMutation({
  args: commonAuthProviderValidator,
  handler: async (ctx, args) => {
    const authProvider = args
    const got = await createUserFromAuthProviderFn(ctx, authProvider)
    if (!got.success) {
      throw new Error(got.op + ": " + got.errorMessage)
    }
    return got.data
  },
})

export type UserFields = WithoutSystemFields<DocUser>

export async function createUserFromAuthProviderFn(
  ctx: MutationCtx,
  authProvider: CommonAuthProvider,
): PromiseResult<UserProfile> {
  const op = "createUserFromAuthProviderFn"

  // Check if authAccount already exists
  const existingAuthAccount = await ctx.db
    .query("authAccounts")
    .withIndex("providerAndAccountId", (q) =>
      q.eq("provider", authProvider.provider).eq("providerAccountId", authProvider.providerId),
    )
    .unique()
  if (existingAuthAccount) {
    return createResultError(op, "Auth account already exists")
  }

  const now = new Date()

  // Create user
  const userName = getUserNameFromCommonAuthProvider(authProvider, "New User")
  const toCreate = {
    name: userName,
    image: authProvider.image,
    email: authProvider.email,
    role: userRole.user,
    createdAt: now.toISOString(),
  } as const satisfies WithoutSystemFields<DocUser>
  const userId = await ctx.db.insert("users", toCreate)
  const userProfile: UserProfile = { ...toCreate, userId, hasPw: false }

  // Create auth account
  await ctx.db.insert("authAccounts", {
    userId,
    provider: authProvider.provider,
    providerAccountId: authProvider.providerId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  })

  return createResult(userProfile)
}
