import type { ActionCtx } from "#convex/_generated/server.js"
import { createResultError, type PromiseResult } from "#result"
import type { IdUser } from "#src/auth/convex/IdUser.ts"
import { authActionCredentialResolve } from "#src/utils/convex_backend/authActionCredentialResolve.ts"

export async function authActionTokenToUserId<T extends { token: string }, R>(
  ctx: ActionCtx,
  args: T,
  fn: (ctx: ActionCtx, data: Omit<T, "token"> & { userId: IdUser }) => PromiseResult<R>,
): PromiseResult<R> {
  const op = "authActionTokenToUserId"
  if (!args.token) {
    return createResultError(op, "missing token")
  }
  const verifiedResult = await authActionCredentialResolve(ctx, args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const userId = verifiedResult.data.userId
  const { token, ...data } = args
  const newData = { ...data, userId }
  return fn(ctx, newData)
}
