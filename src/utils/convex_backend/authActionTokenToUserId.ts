import type { PromiseResult } from "#result"
import type { IdUser } from "#src/auth/convex/IdUser.js"
import { verifyTokenGetUserId } from "#src/auth/server/jwt_token/verifyTokenGetUserId.js"
import type { ActionCtx } from "@convex/_generated/server.js"

export async function authActionTokenToUserId<T extends { token: string }, R>(
  ctx: ActionCtx,
  args: T,
  fn: (ctx: ActionCtx, data: Omit<T, "token"> & { userId: IdUser }) => PromiseResult<R>,
): PromiseResult<R> {
  const verifiedResult = await verifyTokenGetUserId(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const userId = verifiedResult.data
  const { token, ...data } = args
  const newData = { ...data, userId }
  return fn(ctx, newData)
}
