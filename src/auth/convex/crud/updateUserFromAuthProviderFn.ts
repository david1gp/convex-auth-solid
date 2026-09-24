import type { MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { IdUser } from "#src/auth/convex/IdUser.ts"
import { loginProvider } from "#src/auth/model_field/socialLoginProvider.ts"
import {
  type CommonAuthProvider,
  getUserNameFromCommonAuthProvider,
} from "#src/auth/server/social_identity_providers/CommonAuthProvider.ts"

export async function updateUserFromAuthProviderFn(
  ctx: MutationCtx,
  userId: IdUser,
  authProvider: CommonAuthProvider,
): PromiseResult<string> {
  const op = "updateUserFromAuthProviderFn"

  const user = await ctx.db.get("users", userId)
  if (!user) {
    return createResultError(op, "User not found by userId: ", userId)
  }

  // Existing names must not be replaced by username/email fallbacks when the provider omits a real name.
  const userName = getUserNameFromCommonAuthProvider(
    { ...authProvider, username: "", email: undefined },
    user.name || "Updated User",
  )
  const userImage = authProvider.image.trim() ? authProvider.image : user.image

  // Only update if at least one field has changed
  const nameChanged = userName !== user.name
  const imageChanged = userImage !== user.image

  if (!nameChanged && !imageChanged) {
    console.log(userId, "no changes")
    return createResult(userId)
  }
  if (nameChanged) console.log(userId, "name changed", user.name, "->", userName)
  if (imageChanged) console.log(userId, "image changed", user.image, "->", userImage)
  await ctx.db.patch("users", userId, {
    ...(nameChanged && { name: userName }),
    ...(imageChanged && { image: userImage }),
  })

  // Update auth account if needed
  const authAccount =
    authProvider.provider === loginProvider.oidc
      ? await ctx.db
          .query("authAccounts")
          .withIndex("providerIssuerAndAccountId", (q) =>
            q
              .eq("provider", authProvider.provider)
              .eq("issuer", authProvider.issuer)
              .eq("providerAccountId", authProvider.providerId),
          )
          .unique()
      : await ctx.db
          .query("authAccounts")
          .withIndex("userIdAndProvider", (q) => q.eq("userId", userId).eq("provider", authProvider.provider))
          .unique()

  if (authAccount) {
    await ctx.db.patch("authAccounts", authAccount._id, {
      providerAccountId: authProvider.providerId,
      updatedAt: new Date().toISOString(),
    })
  }

  return createResult(userId)
}
