import { envBaseUrlEmailGeneratorResult } from "@/app/env/private/envBaseUrlEmailGeneratorResult"
import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import { createAuthResendEnvVariableNames } from "@/auth/convex/email/createAuthResendEnvVariableNames"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageAuth } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailSignUpV1,
  type GeneratedEmailType,
  type SignUpV1Type,
} from "@adaptive-ds/email-generator/index.js"
import { isDevEnv } from "~ui/env/isDevEnv"
import { sendSingleEmailViaResend } from "~utils/email/resend/sendEmailViaResend"
import type { ResendAddressInfo } from "~utils/email/resend/sendEmailsViaResendApi"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function sendEmailSignUp(name: string, email: string, code: string, url: string): PromiseResult<null> {
  // will be done later
  const data = { code, url, email }

  const generatedResult = await generateEmailSignUp(code, url)
  if (!generatedResult.success) return generatedResult
  const { subject, html, text } = generatedResult.data

  const to: ResendAddressInfo = { name, email }

  if (!isDevEnv()) {
    const emailResult = await sendSingleEmailViaResend(subject, html, text, to, createAuthResendEnvVariableNames())
    if (!emailResult.success) return emailResult
  }

  const envModeResult = envEnvModeResult()
  if (!envModeResult.success) return envModeResult
  const envMode = envModeResult.data
  const telegramResult = await sendTelegramMessageAuth(envMode + " / user sign-up / " + name, data)
  if (!telegramResult.success) return telegramResult

  return createResult(null)
}

export async function generateEmailSignUp(code: string, url: string): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailSignUp"
  const props: SignUpV1Type = {
    // l: "en",
    ...generateSharedEmailProps(),
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
