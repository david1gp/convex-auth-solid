import type { QueryCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { authCredentialResolve } from "#src/utils/convex_backend/authCredentialResolve.ts"

export async function authQueryWrapResult<T extends { token: string }, R>(
  ctx: QueryCtx,
  args: T,
  fn: (ctx: QueryCtx, data: Omit<T, "token">) => Promise<R>,
): PromiseResult<R> {
  const op = "authQueryWrapResult"
  if (!args.token) {
    return createResultError(op, "missing token")
  }
  const verifiedResult = await authCredentialResolve(ctx, args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const { token, ...data } = args
  const out = await fn(ctx, data)
  return createResult(out)
}
