import { createError, createResult, type PromiseResult } from "#result"
import { envBaseUrlEmailGeneratorResult } from "#src/app/env/private/envBaseUrlEmailGeneratorResult.js"
import { envEnvModeResult } from "#src/app/env/public/envEnvModeResult.js"
import { type Language } from "#src/app/i18n/language.js"
import { createAuthResendEnvVariableNames } from "#src/auth/convex/email/createAuthResendEnvVariableNames.js"
import { generateSharedEmailProps } from "#src/auth/convex/email/generateSharedEmailProps.js"
import { sendTelegramMessageAuth } from "#src/auth/convex/telegram/sendTelegramMessageTechnical.js"
import { envMode } from "#ui/env/envMode.js"
import type { ResendAddressInfo } from "#utils/email/resend/sendEmailsViaResendApi.js"
import { sendSingleEmailViaResend } from "#utils/email/resend/sendEmailViaResend.js"
import {
    apiGenerateEmailOrgInvitationV1,
    type GeneratedEmailType,
    type OrgInvitationV1Type,
} from "@adaptive-ds/email-generator/index.js"

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
