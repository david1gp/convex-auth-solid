import { internalQuery, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { socialLoginProviderValidator } from "~auth/model/loginMethodValidator"
import type { DocAuthAccount } from "../IdUser"

export const findUserByAuthAccountValidator = v.object({
  provider: socialLoginProviderValidator,
  providerId: v.string(),
})

export const findUserByAuthAccountQuery = internalQuery({
  args: findUserByAuthAccountValidator,
  handler: async (ctx, args): Promise<DocAuthAccount | null> => {
    return findUserByAuthAccountFn(ctx, args)
  },
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
