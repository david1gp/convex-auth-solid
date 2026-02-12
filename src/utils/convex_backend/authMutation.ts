import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import type { MutationCtx } from "@convex/_generated/server"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function authMutation<T extends { token: string }, R>(
  ctx: MutationCtx,
  args: T,
  fn: (ctx: MutationCtx, data: Omit<T, "token">) => Promise<R>,
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
