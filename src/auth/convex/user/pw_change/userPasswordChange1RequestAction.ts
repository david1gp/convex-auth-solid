import { envBaseUrlAppResult } from "@/app/env/public/envBaseUrlAppResult"
import { languageValidator } from "@/app/i18n/language"
import { sendEmailChangePassword } from "@/auth/convex/email/sendEmailChangePassword"
import type { DocUser } from "@/auth/convex/IdUser"
import { vIdUser } from "@/auth/convex/vIdUser"
import { otpPurpose } from "@/auth/model_field/otpPurpose"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { authActionTokenToUserId } from "@/utils/convex_backend/authActionTokenToUserId"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internal } from "@convex/_generated/api"
import { action, internalAction, type ActionCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import type { PromiseResult } from "~utils/result/Result"

export const userPasswordChange1RequestFieldsBase = {
  l: languageValidator,
} as const

export const userPasswordChange1RequestValidatorPublic = createTokenValidator(userPasswordChange1RequestFieldsBase)
export type UserPasswordChange1RequestTypePublic = typeof userPasswordChange1RequestValidatorPublic.type

export const userPasswordChange1RequestValidatorInternal = v.object({
  ...userPasswordChange1RequestFieldsBase,
  userId: vIdUser,
})

export type UserPasswordChange1RequestTypeInternal = typeof userPasswordChange1RequestValidatorInternal.type

export const userPasswordChange1RequestAction = action({
  args: userPasswordChange1RequestValidatorPublic,
  handler: async (ctx, args) => authActionTokenToUserId(ctx, args, userPasswordChange1RequestActionFn),
})

export const userPasswordChange1RequestInternalAction = internalAction({
  args: userPasswordChange1RequestValidatorInternal,
  handler: userPasswordChange1RequestActionFn,
})

async function userPasswordChange1RequestActionFn(
  ctx: ActionCtx,
  args: UserPasswordChange1RequestTypeInternal,
): PromiseResult<null> {
  const op = "userPasswordChange1RequestActionFn"

  const user: DocUser | null = await ctx.runQuery(internal.auth.userGetInternalQuery, {
    userId: args.userId,
  })
  if (!user) {
    return createErrorAndLogError(op, "User not found")
  }

  if (!user.email) {
    return createErrorAndLogError(op, "User email not found")
  }

  const otpResult = await ctx.runMutation(internal.auth.otpSaveInternalMutation, {
    userId: args.userId,
    email: user.email,
    purpose: otpPurpose.passwordChange,
  })
  if (!otpResult.success) return otpResult
  const otp = otpResult.data

  const baseUrlResult = envBaseUrlAppResult()
  if (!baseUrlResult.success) {
    return baseUrlResult
  }
  const baseUrl = baseUrlResult.data

  const confirmUrl = new URL(pageRouteAuth.userProfileMeChangePassword, baseUrl)
  confirmUrl.searchParams.set("code", otp)
  confirmUrl.searchParams.set("step", "2")
  const url = confirmUrl.toString()

  const sendResult = await sendEmailChangePassword(user.name, user.email, otp, url, args.l)
  if (!sendResult.success) {
    return sendResult
  }

  return { success: true, data: null }
}
