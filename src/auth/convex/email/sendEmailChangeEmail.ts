import { envBaseUrlEmailGeneratorResult } from "@/app/env/private/envBaseUrlEmailGeneratorResult"
import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import type { Language } from "@/app/i18n/language"
import { urlSupportMail } from "@/app/url/urlSupport"
import { createAuthResendEnvVariableNames } from "@/auth/convex/email/createAuthResendEnvVariableNames"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageAuth } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailEmailChangeV1,
  type EmailChangeV1Type,
  type GeneratedEmailType,
} from "@adaptive-ds/email-generator/index.js"
import { envMode } from "~ui/env/envMode"
import { sendSingleEmailViaResend } from "~utils/email/resend/sendEmailViaResend"
import type { ResendAddressInfo } from "~utils/email/resend/sendEmailsViaResendApi"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function sendEmailChangeEmail(
  name: string,
  email: string,
  code: string,
  url: string,
  l: Language,
): PromiseResult<null> {
  const generatedResult = await generateEmailChange(name, code, url, l)
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

  const data = { code, url, email, l }
  const telegramResult = await sendTelegramMessageAuth(env + " / email change request / " + name, data)
  if (!telegramResult.success) return telegramResult

  return createResult(null)
}

export async function generateEmailChange(
  name: string,
  code: string,
  url: string,
  l: Language,
): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailChange"
  const props: EmailChangeV1Type = {
    userName: name,
    ...generateSharedEmailProps(l),
    code,
    url,
    expiryMinutes: 10,
    supportUrl: urlSupportMail,
  }
  const baseUrlResult = envBaseUrlEmailGeneratorResult()
  if (!baseUrlResult.success) return baseUrlResult
  return await apiGenerateEmailEmailChangeV1(props, baseUrlResult.data)
}
