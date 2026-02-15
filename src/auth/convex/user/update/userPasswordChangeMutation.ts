import type { DocUser, IdUser } from "@/auth/convex/IdUser"
import { hashPassword2 } from "@/auth/convex/pw/hashPassword"
import { verifyHashedPassword2 } from "@/auth/convex/pw/verifyHashedPassword"
import { passwordSchema } from "@/auth/model_field/passwordSchema"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { authMutationTokenToUserId } from "@/utils/convex_backend/authMutationTokenToUserId"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { createErrorAndLogWarn } from "@/utils/convex_backend/createErrorAndLogWarn"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { vIdUser } from "@/auth/convex/vIdUser"
import { v } from "convex/values"
import * as a from "valibot"
import { type PromiseResult } from "~utils/result/Result"

const userPasswordChangeFieldsBase = {
  currentPassword: v.optional(v.string()),
  newPassword: v.string(),
} as const

export const userPasswordChangeValidatorInternal = v.object({ ...userPasswordChangeFieldsBase, userId: vIdUser })
export type UserPasswordChangeTypeInternal = typeof userPasswordChangeValidatorInternal.type

export const userPasswordChangeValidatorPublic = createTokenValidator(userPasswordChangeFieldsBase)
export type UserPasswordChangeTypePublic = typeof userPasswordChangeValidatorPublic.type

export const userPasswordChangeMutation = mutation({
  args: userPasswordChangeValidatorPublic,
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, userPasswordChangeFn),
})

export const userPasswordChangeInternalMutation = internalMutation({
  args: userPasswordChangeValidatorInternal,
  handler: async (ctx, args) => userPasswordChangeFn(ctx, args),
})

async function userPasswordChangeFn(ctx: MutationCtx, args: UserPasswordChangeTypeInternal): PromiseResult<string> {
  const op = "userPasswordChangeFn"

  const newPasswordValidation = a.safeParse(passwordSchema, args.newPassword)
  if (!newPasswordValidation.success) {
    return createErrorAndLogWarn(op, newPasswordValidation.issues[0].message)
  }

  const userId = args.userId as IdUser
  const user: DocUser | null = await ctx.db.get("users", userId)
  if (!user) {
    return createErrorAndLogError(op, "User not found")
  }

  if (user.hashedPassword) {
    if (!args.currentPassword) {
      return createErrorAndLogWarn(op, "Current password is required when changing an existing password")
    }

    const currentPasswordVerify = await verifyHashedPassword2(args.currentPassword, user.hashedPassword)
    if (!currentPasswordVerify.success) {
      return createErrorAndLogWarn(op, currentPasswordVerify.errorMessage || "Password verification failed")
    }
    if (!currentPasswordVerify.data) {
      return createErrorAndLogWarn(op, "Current password is incorrect")
    }
  }

  const newPasswordHash = await hashPassword2(args.newPassword)
  if (!newPasswordHash.success) {
    return createErrorAndLogError(op, newPasswordHash.errorMessage || "Password hashing failed")
  }

  await ctx.db.patch("users", userId, {
    hashedPassword: newPasswordHash.data,
    updatedAt: new Date().toISOString(),
  })

  return { success: true, data: userId }
}
