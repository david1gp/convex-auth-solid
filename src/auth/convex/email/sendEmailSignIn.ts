import { envBaseUrlEmailGeneratorResult } from "@/app/env/private/envBaseUrlEmailGeneratorResult"
import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import type { Language } from "@/app/i18n/language"
import { createAuthResendEnvVariableNames } from "@/auth/convex/email/createAuthResendEnvVariableNames"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageAuth } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailSignInV1,
  type GeneratedEmailType,
  type SignInV1Type,
} from "@adaptive-ds/email-generator/index.js"
import { envMode } from "~ui/env/envMode"
import type { ResendAddressInfo } from "~utils/email/resend/sendEmailsViaResendApi"
import { sendSingleEmailViaResend } from "~utils/email/resend/sendEmailViaResend"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function sendEmailSignIn(email: string, code: string, url: string, l: Language): PromiseResult<null> {
  const data = { code, url, email }

  const generatedResult = await generateEmailSignIn(code, url, l)
  if (!generatedResult.success) return generatedResult
  const { subject, html, text } = generatedResult.data

  const to: ResendAddressInfo = { email }

  const envResult = envEnvModeResult()
  if (!envResult.success) return envResult
  const env = envResult.data
  const isProd = env === envMode.production

  if (isProd) {
    const emailResult = await sendSingleEmailViaResend(subject, html, text, to, createAuthResendEnvVariableNames())
    if (!emailResult.success) return emailResult
  } else {
    console.info(env, "-> skipping sending email")
  }

  const telegramResult = await sendTelegramMessageAuth(env + " / user sign in / " + email, data)
  if (!telegramResult.success) return telegramResult

  return createResult(null)
}

export async function generateEmailSignIn(code: string, url: string, l: Language): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailSignIn"
  const props: SignInV1Type = {
    // l: "en",
    ...generateSharedEmailProps(l),
    code,
    url,
  }
  const baseUrlResult = envBaseUrlEmailGeneratorResult()
  if (!baseUrlResult.success) return baseUrlResult
  return apiGenerateEmailSignInV1(props, baseUrlResult.data)
}
