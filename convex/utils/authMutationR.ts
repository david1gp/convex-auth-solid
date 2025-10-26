import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import type { MutationCtx } from "@convex/_generated/server"
import { type PromiseResult } from "~utils/result/Result"

export async function authMutationR<T extends { token: string }, R>(
  ctx: MutationCtx,
  args: T,
  fn: (ctx: MutationCtx, data: Omit<T, "token">) => PromiseResult<R>,
): PromiseResult<R> {
  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const { token, ...data } = args
  return fn(ctx, data)
}
