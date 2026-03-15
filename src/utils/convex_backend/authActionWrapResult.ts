import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import type { ActionCtx } from "@convex/_generated/server"
import { createResult, type PromiseResult } from "~result"

export async function authActionWrapResult<T extends { token: string }, R>(
  ctx: ActionCtx,
  args: T,
  fn: (ctx: ActionCtx, data: Omit<T, "token">) => Promise<R>,
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
