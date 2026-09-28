import type { MutationCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { DecodedToken } from "#src/auth/model/DecodedToken.ts"
import { authCredentialResolve } from "#src/utils/convex_backend/authCredentialResolve.ts"

type AuthMutationTokenClaims = DecodedToken | { kind: "apiKey"; userId: DecodedToken["sub"] }

export async function authMutationWithToken<T extends { token: string }, R>(
  ctx: MutationCtx,
  args: T,
  fn: (ctx: MutationCtx, data: Omit<T, "token">, claims: AuthMutationTokenClaims) => Promise<R>,
): PromiseResult<R> {
  const op = "authMutationWithToken"
  if (!args.token) {
    return createResultError(op, "missing token")
  }
  const verifiedResult = await authCredentialResolve(ctx, args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const { token, ...data } = args
  const claims: AuthMutationTokenClaims =
    verifiedResult.data.kind === "jwt" ? verifiedResult.data.decodedToken : verifiedResult.data
  const out = await fn(ctx, data, claims)
  return createResult(out)
}
