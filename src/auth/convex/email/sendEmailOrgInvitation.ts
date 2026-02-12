import { envBaseUrlEmailGeneratorResult } from "@/app/env/private/envBaseUrlEmailGeneratorResult"
import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import { createAuthResendEnvVariableNames } from "@/auth/convex/email/createAuthResendEnvVariableNames"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageAuth } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailOrgInvitationV1,
  type GeneratedEmailType,
  type OrgInvitationV1Type,
} from "@adaptive-sm/email-generator/index.js"
import { isDevEnv } from "~ui/env/isDevEnv"
import type { ResendAddressInfo } from "~utils/email/resend/sendEmailsViaResendApi"
import { sendSingleEmailViaResend } from "~utils/email/resend/sendEmailViaResend"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export type GenerateEmailOrgInvitationProps = {
  invitedName: string
  invitedByName: string
  invitedByEmail: string
  orgName: string
  url: string
}

export async function sendEmailOrgInvitation(
  invitedEmail: string,
  p: GenerateEmailOrgInvitationProps,
): PromiseResult<null> {
  const envModeResult = envEnvModeResult()
  if (!envModeResult.success) return envModeResult

  const generatedResult = await generateEmailOrgInvitation(p)
  if (!generatedResult.success) return generatedResult
  const { subject, html, text } = generatedResult.data

  const to: ResendAddressInfo = { name: p.invitedName, email: invitedEmail }

  if (!isDevEnv()) {
    const emailResult = await sendSingleEmailViaResend(subject, html, text, to, createAuthResendEnvVariableNames())
    if (!emailResult.success) return emailResult
  }

  const envMode = envModeResult.data
  const name = envMode + " / org invitation"
  const telegramResult = await sendTelegramMessageAuth(name, { invitedEmail, ...p })
  if (!telegramResult.success) return telegramResult

  return createResult(null)
}

export async function generateEmailOrgInvitation(
  p: GenerateEmailOrgInvitationProps,
): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailOrgInvitation"
  const props: OrgInvitationV1Type = {
    ...generateSharedEmailProps(),
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
