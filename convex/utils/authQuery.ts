import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import type { QueryCtx } from "@convex/_generated/server"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function authQuery<T extends { token: string }, R>(
  ctx: QueryCtx,
  args: T,
  fn: (ctx: QueryCtx, data: Omit<T, "token">) => Promise<R>,
): PromiseResult<R> {
  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const { token, ...data } = args
  const out = await fn(ctx, data)
  return createResult(out)
}
