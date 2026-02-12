import type { DocUser, IdUser } from "@/auth/convex/IdUser"
import { otpPurpose } from "@/auth/model_field/otpPurpose"
import { internalMutation, mutation, type MutationCtx } from "@convex/_generated/server"
import { authMutationTokenToUserId } from "@/utils/convex_backend/authMutationTokenToUserId"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { createErrorAndLogWarn } from "@/utils/convex_backend/createErrorAndLogWarn"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { vIdUser } from "@/auth/convex/vIdUser"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import type { PromiseResult } from "~utils/result/Result"
import { otpConsumeFn } from "@/auth/convex/otp/otpConsumeFn"
import { otpFindFn } from "@/auth/convex/otp/otpFindFn"

const userEmailChangeConfirmFieldsBase = {
  newEmail: v.string(),
  confirmationCode: v.string(),
} as const

export const userEmailChangeConfirmValidatorInternal = v.object({ ...userEmailChangeConfirmFieldsBase, userId: vIdUser })
export type UserEmailChangeConfirmTypeInternal = typeof userEmailChangeConfirmValidatorInternal.type

export const userEmailChangeConfirmValidatorPublic = createTokenValidator(userEmailChangeConfirmFieldsBase)
export type UserEmailChangeConfirmTypePublic = typeof userEmailChangeConfirmValidatorPublic.type

export const userEmailChangeConfirmMutation = mutation({
  args: userEmailChangeConfirmValidatorPublic,
  handler: async (ctx, args) => authMutationTokenToUserId(ctx, args, userEmailChangeConfirmFn),
})

export const userEmailChangeConfirmInternalMutation = internalMutation({
  args: userEmailChangeConfirmValidatorInternal,
  handler: async (ctx, args) => userEmailChangeConfirmFn(ctx, args),
})

async function userEmailChangeConfirmFn(
  ctx: MutationCtx,
  args: UserEmailChangeConfirmTypeInternal,
): PromiseResult<string> {
  const op = "userEmailChangeConfirmFn"

  const userId = args.userId as IdUser
  const user: DocUser | null = await ctx.db.get(userId)
  if (!user) {
    return createErrorAndLogError(op, "User not found")
  }

  const otpFindResult = await otpFindFn(ctx, {
    email: args.newEmail,
    code: args.confirmationCode,
    purpose: otpPurpose.emailChange,
  })
  if (!otpFindResult.success) {
    return createErrorAndLogWarn(op, otpFindResult.errorMessage || "Invalid or expired verification code")
  }
  const otpRecord = otpFindResult.data

  await otpConsumeFn(ctx, { otpId: otpRecord._id })

  await ctx.db.patch(userId, {
    email: args.newEmail,
    emailVerifiedAt: nowIso(),
    updatedAt: nowIso(),
  })

  return { success: true, data: userId }
}
