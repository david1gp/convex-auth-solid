import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"
import type { UserProfile } from "@/auth/model/UserProfile"
import { userRole } from "@/auth/model/userRole"
import {
  commonAuthProviderValidator,
  getUserNameFromCommonAuthProvider,
  type CommonAuthProvider,
} from "@/auth/server/social_identity_providers/CommonAuthProvider"
import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import type { WithoutSystemFields } from "convex/server"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocUser } from "../IdUser"

export type UserFields = WithoutSystemFields<DocUser>

export const createUserFromAuthProviderInternalMutation = internalMutation({
  args: commonAuthProviderValidator,
  handler: createUserFromAuthProviderFn,
})

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
  const userProfile: UserProfile = docUserToUserProfile({ _id: userId, _creationTime: now.getTime(), ...toCreate })

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
