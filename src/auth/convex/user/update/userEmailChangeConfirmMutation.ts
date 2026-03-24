import { internalMutation, mutation, type MutationCtx } from "#convex/_generated/server.js"
import type { PromiseResult } from "#result"
import type { DocUser, IdUser } from "#src/auth/convex/IdUser.js"
import { otpConsumeFn } from "#src/auth/convex/otp/otpConsumeFn.js"
import { otpFindFn } from "#src/auth/convex/otp/otpFindFn.js"
import { vIdUser } from "#src/auth/convex/vIdUser.js"
import { otpPurpose } from "#src/auth/model_field/otpPurpose.js"
import { authMutationTokenToUserId } from "#src/utils/convex_backend/authMutationTokenToUserId.js"
import { createErrorAndLogError } from "#src/utils/convex_backend/createErrorAndLogError.js"
import { createErrorAndLogWarn } from "#src/utils/convex_backend/createErrorAndLogWarn.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { nowIso } from "#utils/date/nowIso.js"
import { v } from "convex/values"

const userEmailChangeConfirmFieldsBase = {
  newEmail: v.string(),
  confirmationCode: v.string(),
} as const

export const userEmailChangeConfirmValidatorInternal = v.object({
  ...userEmailChangeConfirmFieldsBase,
  userId: vIdUser,
})
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
  const user: DocUser | null = await ctx.db.get("users", userId)
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

  await ctx.db.patch("users", userId, {
    email: args.newEmail,
    emailVerifiedAt: nowIso(),
    updatedAt: nowIso(),
  })

  return { success: true, data: userId }
}
