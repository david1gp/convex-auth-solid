import type { Id } from "#convex/_generated/dataModel.js"
import { type MutationCtx } from "#convex/_generated/server.js"
import { vIdUser } from "#src/auth/convex/vIdUser.js"
import { socialLoginProviderValidator } from "#src/auth/model_field/loginMethodValidator.js"
import type { LoginProvider } from "#src/auth/model_field/socialLoginProvider.js"
import { v } from "convex/values"

export const linkAuthToExistingUserValidator = v.object({
  userId: vIdUser,
  provider: socialLoginProviderValidator,
  providerId: v.string(),
})

export async function linkAuthToExistingUserFn(
  ctx: MutationCtx,
  userId: Id<"users">,
  provider: LoginProvider,
  providerId: string,
): Promise<Id<"users">> {
  const now = new Date().toISOString()
  // Create auth account for existing user
  await ctx.db.insert("authAccounts", {
    userId: userId,
    provider: provider,
    providerAccountId: providerId,
    // ...authData,
    createdAt: now,
    updatedAt: now,
  })
  return userId
}
