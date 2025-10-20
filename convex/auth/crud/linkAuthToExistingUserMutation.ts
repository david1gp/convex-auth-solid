import type { Id } from "@convex/_generated/dataModel"
import { internalMutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { socialLoginProviderValidator } from "~auth/model/loginMethodValidator"
import type { LoginProvider } from "~auth/model/socialLoginProvider"
import { vIdUsers } from "../vIdUSers"

export const linkAuthToExistingUserValidator = v.object({
  userId: vIdUsers,
  provider: socialLoginProviderValidator,
  providerId: v.string(),
})

export const linkAuthToExistingUserMutation = internalMutation({
  args: linkAuthToExistingUserValidator,
  handler: async (ctx, args): Promise<Id<"users">> => {
    return linkAuthToExistingUserFn(ctx, args.userId, args.provider, args.providerId)
  },
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
