import type { DocAuthAccount } from "#src/auth/convex/IdUser.js"
import { socialLoginProviderValidator } from "#src/auth/model_field/loginMethodValidator.js"
import { type QueryCtx } from "@convex/_generated/server.js"
import { v } from "convex/values"

export const findUserByAuthAccountValidator = v.object({
  provider: socialLoginProviderValidator,
  providerId: v.string(),
})

export async function findUserByAuthAccountFn(
  ctx: QueryCtx,
  authData: typeof findUserByAuthAccountValidator.type,
): Promise<DocAuthAccount | null> {
  return await ctx.db
    .query("authAccounts")
    .withIndex("providerAndAccountId", (q) =>
      q.eq("provider", authData.provider).eq("providerAccountId", authData.providerId),
    )
    .unique()
}
