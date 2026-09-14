import { v } from "convex/values"
import type { QueryCtx } from "#convex/_generated/server.js"
import type { DocAuthAccount } from "#src/auth/convex/IdUser.ts"
import { loginProviderValidator } from "#src/auth/model_field/loginMethodValidator.ts"
import { loginProvider } from "#src/auth/model_field/socialLoginProvider.ts"

export const findUserByAuthAccountValidator = v.object({
  provider: loginProviderValidator,
  issuer: v.optional(v.string()),
  providerId: v.string(),
})

export async function findUserByAuthAccountFn(
  ctx: QueryCtx,
  authData: typeof findUserByAuthAccountValidator.type,
): Promise<DocAuthAccount | null> {
  if (authData.provider === loginProvider.oidc) {
    if (!authData.issuer) return null
    return await ctx.db
      .query("authAccounts")
      .withIndex("providerIssuerAndAccountId", (q) =>
        q.eq("provider", authData.provider).eq("issuer", authData.issuer).eq("providerAccountId", authData.providerId),
      )
      .unique()
  }

  return await ctx.db
    .query("authAccounts")
    .withIndex("providerAndAccountId", (q) =>
      q.eq("provider", authData.provider).eq("providerAccountId", authData.providerId),
    )
    .unique()
}
