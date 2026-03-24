import { createResult, createResultError, type PromiseResult } from "#result"
import { findUserByEmailFn } from "#src/auth/convex/crud/findUserByEmailQuery.js"
import { userDeleteHardOtps } from "#src/auth/convex/user/delete_hard/userDeleteHardOtps.js"
import { userDeleteHardAuthAccounts } from "#src/auth/convex/user/delete_hard_parts/userDeleteHardAuthAccounts.js"
import { userDeleteHardAuthSessions } from "#src/auth/convex/user/delete_hard_parts/userDeleteHardAuthSessions.js"
import { userDeleteHardEmailLoginCodes } from "#src/auth/convex/user/delete_hard_parts/userDeleteHardEmailLoginCodes.js"
import { userDeleteHardFiles } from "#src/auth/convex/user/delete_hard_parts/userDeleteHardFiles.js"
import { userDeleteHardOrgMemberships } from "#src/auth/convex/user/delete_hard_parts/userDeleteHardOrgMemberships.js"
import { authMutationTokenToUserId } from "#src/utils/convex_backend/authMutationTokenToUserId.js"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server.js"
import {
    userDeleteValidatorInternal,
    userDeleteValidatorPublic,
    type UserDeleteValidatorInternalType,
} from "./userDeleteValidator.js"

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
