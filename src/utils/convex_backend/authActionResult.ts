import type { ActionCtx } from "#convex/_generated/server.js"
import { createResultError, type PromiseResult } from "#result"
import { authActionCredentialResolve } from "#src/utils/convex_backend/authActionCredentialResolve.ts"

export async function authActionResult<T extends { token: string }, R>(
  ctx: ActionCtx,
  args: T,
  fn: (ctx: ActionCtx, data: Omit<T, "token">) => PromiseResult<R>,
): PromiseResult<R> {
  const op = "authActionResult"
  if (!args.token) {
    return createResultError(op, "missing token")
  }
  const verifiedResult = await authActionCredentialResolve(ctx, args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const { token, ...data } = args
  return fn(ctx, data)
}
