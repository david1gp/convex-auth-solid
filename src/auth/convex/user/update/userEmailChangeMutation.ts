import type { DocUser, IdUser } from "@/auth/convex/IdUser"
import { otpSaveFn } from "@/auth/convex/otp/otpSaveFn"
import { verifyHashedPassword2 } from "@/auth/convex/pw/verifyHashedPassword"
import { vIdUser } from "@/auth/convex/vIdUser"
import { otpPurpose } from "@/auth/model_field/otpPurpose"
import { authMutationTokenToUserId } from "@/utils/convex_backend/authMutationTokenToUserId"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { createErrorAndLogWarn } from "@/utils/convex_backend/createErrorAndLogWarn"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as a from "valibot"
import { type PromiseResult } from "~result"

export const userEmailChangeFieldsBase = {
  currentPassword: v.optional(v.string()),
  newEmail: v.string(),
} as const

export const userEmailChangeValidatorInternal = v.object({ ...userEmailChangeFieldsBase, userId: vIdUser })
export type UserEmailChangeTypeInternal = typeof userEmailChangeValidatorInternal.type

export const userEmailChangeValidatorPublic = createTokenValidator(userEmailChangeFieldsBase)
export type UserEmailChangeTypePublic = typeof userEmailChangeValidatorPublic.type

export const userEmailChangeMutation = mutation({
  args: userEmailChangeValidatorPublic,
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, userEmailChangeFn),
})

export const userEmailChangeInternalMutation = internalMutation({
  args: userEmailChangeValidatorInternal,
  handler: async (ctx, args) => userEmailChangeFn(ctx, args),
})

async function userEmailChangeFn(ctx: MutationCtx, args: UserEmailChangeTypeInternal): PromiseResult<string> {
  const op = "userEmailChangeFn"

  const emailValidation = a.safeParse(emailSchema, args.newEmail)
  if (!emailValidation.success) {
    return createErrorAndLogWarn(op, emailValidation.issues[0].message, args.newEmail)
  }

  const userId = args.userId as IdUser
  const user: DocUser | null = await ctx.db.get("users", userId)
  if (!user) {
    return createErrorAndLogError(op, "User not found")
  }

  if (user.hashedPassword) {
    if (!args.currentPassword) {
      return createErrorAndLogWarn(op, "Current password is required for users with password")
    }
    const passwordVerify = await verifyHashedPassword2(args.currentPassword, user.hashedPassword)
    if (!passwordVerify.success) {
      return createErrorAndLogWarn(op, passwordVerify.errorMessage || "Password verification failed")
    }
    if (!passwordVerify.data) {
      return createErrorAndLogWarn(op, "Current password is incorrect")
    }
  }

  const existingUser = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", args.newEmail))
    .unique()
  if (existingUser) {
    return createErrorAndLogWarn(op, "Email already in use")
  }

  const saveResult = await otpSaveFn(ctx, { userId, email: args.newEmail, purpose: otpPurpose.emailChange })
  if (!saveResult.success) return saveResult

  return { success: true, data: saveResult.data }
}
