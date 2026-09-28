import type { MutationCtx } from "#convex/_generated/server.js"
import { createResultError, type PromiseResult } from "#result"
import { authCredentialResolve } from "#src/utils/convex_backend/authCredentialResolve.ts"

export async function authMutationResult<T extends { token: string }, R>(
  ctx: MutationCtx,
  args: T,
  fn: (ctx: MutationCtx, data: Omit<T, "token">) => PromiseResult<R>,
): PromiseResult<R> {
  const op = "authMutationResult"
  if (!args.token) {
    return createResultError(op, "missing token")
  }
  const verifiedResult = await authCredentialResolve(ctx, args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const { token, ...data } = args
  return fn(ctx, data)
}
