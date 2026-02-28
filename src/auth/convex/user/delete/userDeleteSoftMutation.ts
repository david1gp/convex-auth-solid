import { findUserByEmailFn } from "@/auth/convex/crud/findUserByEmailQuery"
import { authMutationTokenToUserId } from "@/utils/convex_backend/authMutationTokenToUserId"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import {
  userDeleteValidatorInternal,
  userDeleteValidatorPublic,
  type UserDeleteValidatorInternalType,
} from "./userDeleteValidator"

export const userDeleteSoftMutation = mutation({
  args: userDeleteValidatorPublic,
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, userDeleteSoftMutationFn),
})

export const userDeleteSoftInternalMutation = internalMutation({
  args: userDeleteValidatorInternal,
  handler: userDeleteSoftMutationFn,
})

export async function userDeleteSoftMutationFn(
  ctx: MutationCtx,
  args: UserDeleteValidatorInternalType,
): PromiseResult<null> {
  const op = "userDeleteSoftMutationFn"

  // Find user by ID or email
  let userId = args.userId
  if (!userId && args.email) {
    const user = await findUserByEmailFn(ctx, args.email)
    if (!user) return createResultError(op, "User not found")
    userId = user._id
  }
  if (!userId) return createResultError(op, "Either userId or email must be provided")

  const user = await ctx.db.get("users", userId)
  if (!user) return createResultError(op, "User not found", userId)
  if (user.deletedAt) return createResultError(op, "User already deleted", userId)

  // Mark user as deleted
  const now = new Date().toISOString()
  await ctx.db.patch("users", userId, { deletedAt: now })

  return createResult(null)
}
