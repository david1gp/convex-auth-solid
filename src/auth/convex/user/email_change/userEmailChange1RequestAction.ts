import { envBaseUrlAppResult } from "@/app/env/public/envBaseUrlAppResult"
import { languageValidator } from "@/app/i18n/language"
import { sendEmailChangeEmail } from "@/auth/convex/email/sendEmailChangeEmail"
import type { DocUser } from "@/auth/convex/IdUser"
import { verifyHashedPassword2 } from "@/auth/convex/pw/verifyHashedPassword"
import { vIdUser } from "@/auth/convex/vIdUser"
import { otpPurpose } from "@/auth/model_field/otpPurpose"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { authActionTokenToUserId } from "@/utils/convex_backend/authActionTokenToUserId"
import { createErrorAndLogError } from "@/utils/convex_backend/createErrorAndLogError"
import { createErrorAndLogWarn } from "@/utils/convex_backend/createErrorAndLogWarn"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { internal } from "@convex/_generated/api"
import { action, internalAction, type ActionCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as a from "valibot"
import { type PromiseResult } from "~utils/result/Result"

export const userEmailChangeFieldsBase = {
  newEmail: v.string(),
  currentPassword: v.optional(v.string()),
  l: languageValidator,
} as const

export const userEmailChangeValidatorPublic = createTokenValidator(userEmailChangeFieldsBase)
export type UserEmailChangeTypePublic = typeof userEmailChangeValidatorPublic.type

export const userEmailChangeValidatorInternal = v.object({ ...userEmailChangeFieldsBase, userId: vIdUser })

export type UserEmailChangeTypeInternal = typeof userEmailChangeValidatorInternal.type

export const userEmailChange1RequestAction = action({
  args: userEmailChangeValidatorPublic,
  handler: async (ctx, args) => authActionTokenToUserId(ctx, args, userEmailChange1RequestActionFn),
})

export const userEmailChange1RequestInternalAction = internalAction({
  args: userEmailChangeValidatorInternal,
  handler: userEmailChange1RequestActionFn,
})

async function userEmailChange1RequestActionFn(ctx: ActionCtx, args: UserEmailChangeTypeInternal): PromiseResult<null> {
  const op = "userEmailChangeFn"

  const emailValidation = a.safeParse(emailSchema, args.newEmail)
  if (!emailValidation.success) {
    return createErrorAndLogWarn(op, emailValidation.issues[0].message, args.newEmail)
  }

  const user: DocUser | null = await ctx.runQuery(internal.auth.userGetInternalQuery, {
    userId: args.userId,
  })
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

  const existingUser = await ctx.runQuery(internal.auth.findUserByEmailInternalQuery, { email: args.newEmail })
  if (existingUser) {
    return createErrorAndLogWarn(op, "Email already in use")
  }

  const otpResult = await ctx.runMutation(internal.auth.otpSaveInternalMutation, {
    userId: args.userId,
    email: args.newEmail,
    purpose: otpPurpose.emailChange,
  })
  if (!otpResult.success) return otpResult
  const otp = otpResult.data

  const baseUrlResult = envBaseUrlAppResult()
  if (!baseUrlResult.success) {
    return baseUrlResult
  }
  const baseUrl = baseUrlResult.data

  const confirmUrl = new URL(pageRouteAuth.userProfileMeChangeEmail, baseUrl)
  confirmUrl.searchParams.set("email", args.newEmail)
  confirmUrl.searchParams.set("code", otp)
  confirmUrl.searchParams.set("step", "2")
  const url = confirmUrl.toString()

  const sendResult = await sendEmailChangeEmail(user.name, args.newEmail, otp, url, args.l)
  if (!sendResult.success) {
    return sendResult
  }

  return { success: true, data: null }
}
