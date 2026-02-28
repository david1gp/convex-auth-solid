import { envBaseUrlEmailGeneratorResult } from "@/app/env/private/envBaseUrlEmailGeneratorResult"
import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import { type Language } from "@/app/i18n/language"
import { createAuthResendEnvVariableNames } from "@/auth/convex/email/createAuthResendEnvVariableNames"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageAuth } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailOrgInvitationV1,
  type GeneratedEmailType,
  type OrgInvitationV1Type,
} from "@adaptive-ds/email-generator/index.js"
import { envMode } from "~ui/env/envMode"
import type { ResendAddressInfo } from "~utils/email/resend/sendEmailsViaResendApi"
import { sendSingleEmailViaResend } from "~utils/email/resend/sendEmailViaResend"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export type GenerateEmailOrgInvitationProps = {
  invitedName: string
  invitedByName: string
  invitedByEmail: string
  orgName: string
  url: string
  l: Language
}

export async function sendEmailOrgInvitation(
  invitedEmail: string,
  p: GenerateEmailOrgInvitationProps,
): PromiseResult<null> {
  const generatedResult = await generateEmailOrgInvitation(p)
  if (!generatedResult.success) return generatedResult
  const { subject, html, text } = generatedResult.data

  const to: ResendAddressInfo = { name: p.invitedName, email: invitedEmail }

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

  const name = env + " / org invitation"
  const telegramResult = await sendTelegramMessageAuth(name, { invitedEmail, ...p })
  if (!telegramResult.success) return telegramResult

  return createResult(null)
}

export async function generateEmailOrgInvitation(
  p: GenerateEmailOrgInvitationProps,
): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailOrgInvitation"
  const props: OrgInvitationV1Type = {
    ...generateSharedEmailProps(p.l),
    ...p,
  }
  const baseUrlResult = envBaseUrlEmailGeneratorResult()
  if (!baseUrlResult.success) return baseUrlResult
  const generatedResult = await apiGenerateEmailOrgInvitationV1(props, baseUrlResult.data)
  if (!generatedResult.success) {
    return createError(op, "Failed to generate email: " + generatedResult.errorMessage)
  }
  return generatedResult
}
