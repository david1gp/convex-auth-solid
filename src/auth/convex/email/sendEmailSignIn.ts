import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { createAuthResendEnvVariableNames } from "@/auth/convex/email/createAuthResendEnvVariableNames"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageTechnical } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailSignInV1,
  type GeneratedEmailType,
  type SignInV1Type,
} from "@adaptive-sm/email-generator/index.js"
import { isDevEnv } from "~ui/env/isDevEnv"
import type { ResendAddressInfo } from "~utils/email/resend/sendEmailsViaResendApi"
import { sendSingleEmailViaResend } from "~utils/email/resend/sendEmailViaResend"
import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import { envBaseUrlEmailGeneratorResult } from "@/app/env/private/envBaseUrlEmailGeneratorResult"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function sendEmailSignIn(email: string, code: string, url: string): PromiseResult<null> {
  const envModeResult = envEnvModeResult()
  if (!envModeResult.success) return envModeResult
  const envMode = envModeResult.data
  const name = envMode + " / user sign in"
  const data = { code, url, email }

  const generatedResult = await generateEmailSignIn(code, url)
  if (!generatedResult.success) return generatedResult
  const { subject, html, text } = generatedResult.data

  const to: ResendAddressInfo = { email }

  if (!isDevEnv()) {
    const emailResult = await sendSingleEmailViaResend(subject, html, text, to, createAuthResendEnvVariableNames())
    if (!emailResult.success) return emailResult
  }

  const telegramResult = await sendTelegramMessageTechnical(name, data)
  if (!telegramResult.success) return telegramResult

  return createResult(null)
}

export async function generateEmailSignIn(code: string, url: string): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailSignIn"
  const props: SignInV1Type = {
    // l: "en",
    ...generateSharedEmailProps(),
    code,
    url,
  }
  const baseUrlResult = envBaseUrlEmailGeneratorResult()
  if (!baseUrlResult.success) return baseUrlResult
  return apiGenerateEmailSignInV1(props, baseUrlResult.data)
}
