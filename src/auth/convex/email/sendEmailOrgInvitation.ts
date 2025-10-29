import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageTechnical } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import { apiGenerateEmailLoginCodeV1 } from "@adaptive-sm/email-generator/apiGenerateEmail.js"
import { type GeneratedEmailType } from "@adaptive-sm/email-generator/GeneratedEmailType.js"
import { type LoginCodeV1Type } from "@adaptive-sm/email-generator/LoginCodeV1Type.js"
import type { RegisterEmailV1Type } from "@adaptive-sm/email-generator/RegisterEmailV1Type.js"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createError, type PromiseResult } from "~utils/result/Result"

export async function sendEmailOrgInvitation(email: string, code: string, url: string): PromiseResult<null> {
  const envModeResult = readEnvVariableResult(publicEnvVariableName.PUBLIC_ENV_MODE)
  if (!envModeResult.success) return envModeResult
  const envMode = envModeResult.data
  const name = envMode + " / org invitation"
  const data = { code, url, email }
  return await sendTelegramMessageTechnical(name, data)
}

export async function generateEmailOrgInvitation(code: string, url: string): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailOrgInvitation"

  const props = generateProps(code, url)
  const baseUrlResult = readEnvVariableResult(privateEnvVariableName.BASE_URL_EMAIL_GENERATOR)
  if (!baseUrlResult.success) return baseUrlResult
  const generatedResult = await apiGenerateEmailLoginCodeV1(props, baseUrlResult.data) // TODO: Use invitation specific generator

  if (!generatedResult.success) {
    return createError(op, "Failed to generate email")
  }

  return generatedResult
}

export async function apiGenerateEmailOrgInvitation(props: LoginCodeV1Type): PromiseResult<GeneratedEmailType> {
  const op = "apiGenerateEmailOrgInvitation"
  const baseUrlResult = readEnvVariableResult(privateEnvVariableName.BASE_URL_EMAIL_GENERATOR)
  if (!baseUrlResult.success) return baseUrlResult
  return apiGenerateEmailLoginCodeV1(props, baseUrlResult.data)
}

function generateProps(code: string, url: string): RegisterEmailV1Type {
  const preset = {
    ...generateSharedEmailProps(),
    l: "en",
  } as const satisfies Partial<RegisterEmailV1Type>
  return { ...preset, code, url }
}