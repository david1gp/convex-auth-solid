import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import type { ActionCtx } from "@convex/_generated/server"
import type { PromiseResult } from "~utils/result/Result"

export async function authActionTokenToUserId<T extends { token: string }, R>(
  ctx: ActionCtx,
  args: T,
  fn: (ctx: ActionCtx, data: Omit<T, "token"> & { userId: IdUser }) => PromiseResult<R>,
): PromiseResult<R> {
  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const userId = verifiedResult.data.sub as IdUser
  const { token, ...data } = args
  const newData = { ...data, userId }
  return fn(ctx, newData)
}
