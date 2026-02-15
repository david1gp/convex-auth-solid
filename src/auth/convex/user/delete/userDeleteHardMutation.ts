import { findUserByEmailFn } from "@/auth/convex/crud/findUserByEmailQuery"
import { userDeleteHardOtps } from "@/auth/convex/user/delete/delete_hard/userDeleteHardOtps"
import { authMutationTokenToUserId } from "@/utils/convex_backend/authMutationTokenToUserId"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import {
  userDeleteValidatorInternal,
  userDeleteValidatorPublic,
  type UserDeleteValidatorInternalType,
} from "./userDeleteValidator"

export const userDeleteHardMutation = mutation({
  args: userDeleteValidatorPublic,
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, userDeleteHardMutationFn),
})

export const userDeleteHardInternalMutation = internalMutation({
  args: userDeleteValidatorInternal,
  handler: userDeleteHardMutationFn,
})

export async function userDeleteHardMutationFn(
  ctx: MutationCtx,
  args: UserDeleteValidatorInternalType,
): PromiseResult<null> {
  const op = "userDeleteHardMutationFn"

  let userId = args.userId
  if (!userId && args.email) {
    const user = await findUserByEmailFn(ctx, args.email)
    if (!user) return createResult(null)
    userId = user._id
  }

  if (!userId) return createResultError(op, "Either userId or email must be provided")

  const user = await ctx.db.get("users", userId)
  if (!user) return createResultError(op, "User not found")

  await userDeleteHardOtps(ctx, userId)

  await ctx.db.delete("users", userId)

  return createResult(null)
}
