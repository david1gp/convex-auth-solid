import type { ActionCtx } from "#convex/_generated/server.js"
import { createResult, createResultError, type PromiseResult } from "#result"
import { authActionCredentialResolve } from "#src/utils/convex_backend/authActionCredentialResolve.ts"

export async function authActionWrapResult<T extends { token: string }, R>(
  ctx: ActionCtx,
  args: T,
  fn: (ctx: ActionCtx, data: Omit<T, "token">) => Promise<R>,
): PromiseResult<R> {
  const op = "authActionWrapResult"
  if (!args.token) {
    return createResultError(op, "missing token")
  }
  const verifiedResult = await authActionCredentialResolve(ctx, args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const { token, ...data } = args
  const out = await fn(ctx, data)
  return createResult(out)
}
