import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import type { QueryCtx } from "@convex/_generated/server"
import { type PromiseResult } from "~result"

export async function authQueryResult<T extends { token: string }, R>(
  ctx: QueryCtx,
  args: T,
  fn: (ctx: QueryCtx, data: Omit<T, "token">) => PromiseResult<R>,
): PromiseResult<R> {
  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const { token, ...data } = args
  return fn(ctx, data)
}
