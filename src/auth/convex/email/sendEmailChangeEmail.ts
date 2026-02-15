import { envBaseUrlEmailGeneratorResult } from "@/app/env/private/envBaseUrlEmailGeneratorResult"
import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import { createAuthResendEnvVariableNames } from "@/auth/convex/email/createAuthResendEnvVariableNames"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageAuth } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailEmailChangeV1,
  type EmailChangeV1Type,
  type GeneratedEmailType,
} from "@adaptive-ds/email-generator/index.js"
import { isDevEnv } from "~ui/env/isDevEnv"
import { sendSingleEmailViaResend } from "~utils/email/resend/sendEmailViaResend"
import type { ResendAddressInfo } from "~utils/email/resend/sendEmailsViaResendApi"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function sendEmailChangeEmail(
  name: string,
  email: string,
  code: string,
  url: string,
): PromiseResult<null> {
  const generatedResult = await generateEmailChange(name, code, url)
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
  const data = { code, url, email }
  const telegramResult = await sendTelegramMessageAuth(envMode + " / email change request / " + name, data)
  if (!telegramResult.success) return telegramResult

  return createResult(null)
}

export async function generateEmailChange(
  name: string,
  code: string,
  url: string,
): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailChange"
  const props: EmailChangeV1Type = {
    userName: name,
    ...generateSharedEmailProps(),
    code,
    url,
    expiryMinutes: 10,
  }
  const baseUrlResult = envBaseUrlEmailGeneratorResult()
  if (!baseUrlResult.success) return baseUrlResult
  return await apiGenerateEmailEmailChangeV1(props, baseUrlResult.data)
}
