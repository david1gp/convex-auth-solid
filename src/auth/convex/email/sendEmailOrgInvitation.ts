import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageTechnical } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailOrgInvitationV1,
  type GeneratedEmailType,
  type OrgInvitationV1Type,
} from "@adaptive-sm/email-generator/index.js"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createError, type PromiseResult } from "~utils/result/Result"

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
  const envModeResult = readEnvVariableResult(publicEnvVariableName.PUBLIC_ENV_MODE)
  if (!envModeResult.success) return envModeResult
  const envMode = envModeResult.data
  const name = envMode + " / org invitation"
  return await sendTelegramMessageTechnical(name, p)
}

export async function generateEmailOrgInvitation(
  p: GenerateEmailOrgInvitationProps,
): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailOrgInvitation"

  const props: OrgInvitationV1Type = {
    ...generateSharedEmailProps(),
    ...p,
  }
  const baseUrlResult = readEnvVariableResult(privateEnvVariableName.BASE_URL_EMAIL_GENERATOR)
  if (!baseUrlResult.success) return baseUrlResult
  const generatedResult = await apiGenerateEmailOrgInvitationV1(props, baseUrlResult.data)
  if (!generatedResult.success) {
    return createError(op, "Failed to generate email: " + generatedResult.errorMessage)
  }
  return generatedResult
}
