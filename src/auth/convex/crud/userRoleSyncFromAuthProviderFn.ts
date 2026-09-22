import type { MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { DocUser, IdUser } from "#src/auth/convex/IdUser.ts"
import { loginProvider } from "#src/auth/model_field/socialLoginProvider.ts"
import type { CommonAuthProvider } from "#src/auth/server/social_identity_providers/CommonAuthProvider.ts"

export async function userRoleSyncFromAuthProviderFn(
  ctx: MutationCtx,
  userId: IdUser,
  authProvider: CommonAuthProvider,
): PromiseResult<DocUser> {
  const op = "userRoleSyncFromAuthProviderFn"
  const user = await ctx.db.get("users", userId)
  if (!user) return createResultError(op, "User not found by userId", userId)
  if (authProvider.provider !== loginProvider.oidc || authProvider.role === undefined) return createResult(user)
  if (user.role === authProvider.role) return createResult(user)

  const updatedAt = new Date().toISOString()
  await ctx.db.patch("users", userId, { role: authProvider.role, updatedAt })
  return createResult({ ...user, role: authProvider.role, updatedAt })
}
