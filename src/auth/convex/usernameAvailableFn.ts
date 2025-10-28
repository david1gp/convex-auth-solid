import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const usernameAvailableFields = {
  username: v.string(),
} as const

export type UsernameAvailableValidatorType = typeof usernameAvailableValidator.type
export const usernameAvailableValidator = v.object(usernameAvailableFields)

export async function usernameAvailableFn(
  ctx: QueryCtx,
  args: UsernameAvailableValidatorType,
): PromiseResult<boolean> {
  const op = "usernameAvailableFn"
  const user = await ctx.db
    .query("users")
    .withIndex("username", (q) => q.eq("username", args.username))
    .unique()
  if (user) {
    return createResult(false)
  }
  return createResult(true)
}
