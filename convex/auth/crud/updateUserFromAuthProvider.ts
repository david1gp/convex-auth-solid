import type { Id } from "@convex/_generated/dataModel"
import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import {
    commonAuthProviderValidator,
    getUserNameFromCommonAuthProvider,
    type CommonAuthProvider,
} from "~auth/server/social_identity_providers/CommonAuthProvider"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { vIdUsers } from "../vIdUSers"

export const updateUserFromAuthProvider = internalMutation({
  args: {
    userId: vIdUsers,
    ...commonAuthProviderValidator.fields,
  },
  handler: async (ctx, args) => {
    const { userId: userIdString, ...authProvider } = args
    const userId = userIdString as Id<"users">
    const got = await updateUserFromAuthProviderFn(ctx, userId, authProvider)
    if (!got.success) {
      throw new Error(got.op + ": " + got.errorMessage)
    }
    return got.data
  },
})

export async function updateUserFromAuthProviderFn(
  ctx: MutationCtx,
  userId: Id<"users">,
  authProvider: CommonAuthProvider,
): PromiseResult<string> {
  const op = "updateUserFromAuthProviderFn"

  const user = await ctx.db.get(userId)
  if (!user) {
    return createResultError(op, "User not found by userId: ", userId)
  }

  const userName = getUserNameFromCommonAuthProvider(authProvider, user.name || "Updated User")
  const userImage = authProvider.image ?? user.image
  const userEmail = authProvider.email ?? user.email

  // Only update if at least one field has changed
  const nameChanged = userName !== user.name
  const imageChanged = userImage !== user.image
  const emailChanged = userEmail !== user.email

  if (!nameChanged && !imageChanged && !emailChanged) {
    console.log(userId, "no changes")
    return createResult(userId)
  }
  if (nameChanged) console.log(userId, "name changed", user.name, "->", userName)
  if (imageChanged) console.log(userId, "image changed", user.image, "->", userImage)
  if (emailChanged) console.log(userId, "email changed", user.email, "->", userEmail)

  await ctx.db.patch(userId, {
    ...(nameChanged && { name: userName }),
    ...(imageChanged && { image: userImage }),
    ...(emailChanged && { email: userEmail }),
  })

  // Update auth account if needed
  const authAccount = await ctx.db
    .query("authAccounts")
    .withIndex("userIdAndProvider", (q) => q.eq("userId", userId).eq("provider", authProvider.provider))
    .unique()

  if (authAccount) {
    await ctx.db.patch(authAccount._id, {
      providerAccountId: authProvider.providerId,
      updatedAt: new Date().toISOString(),
    })
  }

  return createResult(userId)
}
