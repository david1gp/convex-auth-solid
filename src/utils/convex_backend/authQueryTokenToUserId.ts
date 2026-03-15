import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenGetUserId } from "@/auth/server/jwt_token/verifyTokenGetUserId"
import type { QueryCtx } from "@convex/_generated/server"
import type { PromiseResult } from "~result"

export async function authQueryTokenToUserId<T extends { token: string }, R>(
  ctx: QueryCtx,
  args: T,
  fn: (ctx: QueryCtx, data: Omit<T, "token"> & { userId: IdUser }) => PromiseResult<R>,
): PromiseResult<R> {
  const op = "authQueryTokenToUserId"
  const verifiedResult = await verifyTokenGetUserId(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const userId = verifiedResult.data
  const { token, ...data } = args
  const newData = { ...data, userId }
  // console.log({ op, args, data, newData })
  return fn(ctx, newData)
}
