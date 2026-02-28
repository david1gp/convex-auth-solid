import { envBaseUrlEmailGeneratorResult } from "@/app/env/private/envBaseUrlEmailGeneratorResult"
import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import type { Language } from "@/app/i18n/language"
import { createAuthResendEnvVariableNames } from "@/auth/convex/email/createAuthResendEnvVariableNames"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageAuth } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailSignUpV1,
  type GeneratedEmailType,
  type SignUpV1Type,
} from "@adaptive-ds/email-generator/index.js"
import { envMode } from "~ui/env/envMode"
import { sendSingleEmailViaResend } from "~utils/email/resend/sendEmailViaResend"
import type { ResendAddressInfo } from "~utils/email/resend/sendEmailsViaResendApi"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function sendEmailSignUp(
  name: string,
  email: string,
  code: string,
  url: string,
  l: Language,
): PromiseResult<null> {
  const data = { code, url, email }

  const generatedResult = await generateEmailSignUp(code, url, l)
  if (!generatedResult.success) return generatedResult
  const { subject, html, text } = generatedResult.data

  const to: ResendAddressInfo = { name, email }

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

  const telegramResult = await sendTelegramMessageAuth(env + " / user sign-up / " + name, data)
  if (!telegramResult.success) return telegramResult

  return createResult(null)
}

export async function generateEmailSignUp(code: string, url: string, l: Language): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailSignUp"
  const props: SignUpV1Type = {
    // l: "en",
    ...generateSharedEmailProps(l),
    code,
    url,
  }
  return await apiGenerateRegisterEmail(props)
}

export async function apiGenerateRegisterEmail(props: SignUpV1Type): PromiseResult<GeneratedEmailType> {
  const baseUrlResult = envBaseUrlEmailGeneratorResult()
  if (!baseUrlResult.success) return baseUrlResult
  return apiGenerateEmailSignUpV1(props, baseUrlResult.data)
}
