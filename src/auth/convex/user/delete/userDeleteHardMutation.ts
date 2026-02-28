import { findUserByEmailFn } from "@/auth/convex/crud/findUserByEmailQuery"
import { userDeleteHardOtps } from "@/auth/convex/user/delete_hard/userDeleteHardOtps"
import { userDeleteHardAuthAccounts } from "@/auth/convex/user/delete_hard_parts/userDeleteHardAuthAccounts"
import { userDeleteHardAuthSessions } from "@/auth/convex/user/delete_hard_parts/userDeleteHardAuthSessions"
import { userDeleteHardEmailLoginCodes } from "@/auth/convex/user/delete_hard_parts/userDeleteHardEmailLoginCodes"
import { userDeleteHardFiles } from "@/auth/convex/user/delete_hard_parts/userDeleteHardFiles"
import { userDeleteHardOrgMemberships } from "@/auth/convex/user/delete_hard_parts/userDeleteHardOrgMemberships"
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

  // Find user by ID or email
  let userId = args.userId
  if (!userId && args.email) {
    const user = await findUserByEmailFn(ctx, args.email)
    if (!user) return createResult(null) // idempotent - user not found
    userId = user._id
  }

  if (!userId) return createResultError(op, "Either userId or email must be provided")

  const user = await ctx.db.get("users", userId)
  if (!user) return createResultError(op, "User not found")

  // Clean up ALL dependent records in dependency order
  await userDeleteHardAuthSessions(ctx, userId)
  await userDeleteHardOtps(ctx, userId)
  await userDeleteHardEmailLoginCodes(ctx, userId)
  await userDeleteHardAuthAccounts(ctx, userId)
  await userDeleteHardOrgMemberships(ctx, userId)
  await userDeleteHardFiles(ctx, userId)

  // Finally delete user record
  await ctx.db.delete("users", userId)

  return createResult(null)
}
