import { socialLoginProviderValidator } from "@/auth/model_field/loginMethodValidator"
import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import type { DocAuthAccount } from "@/auth/convex/IdUser"

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
