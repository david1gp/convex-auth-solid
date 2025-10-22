import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageTechnical } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import { apiGenerateEmailLoginCodeV1, type SuccessResponseType } from "@adaptive-sm/email-generator/apiGenerateEmail.js"
import { type GeneratedEmailType } from "@adaptive-sm/email-generator/GeneratedEmailType.js"
import { type LoginCodeV1Type } from "@adaptive-sm/email-generator/LoginCodeV1Type.js"
import type { RegisterEmailV1Type } from "@adaptive-sm/email-generator/RegisterEmailV1Type.js"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createError, type PromiseResult } from "~utils/result/Result"

export async function sendEmailSignIn(email: string, code: string, url: string): PromiseResult<null> {
  const envModeResult = readEnvVariableResult(publicEnvVariableName.PUBLIC_ENV_MODE)
  if (!envModeResult.success) return envModeResult
  const envMode = envModeResult.data
  const name = envMode + " / user sign in"
  const data = { code, url, email }
  return await sendTelegramMessageTechnical(name, data)
}

export async function generateEmailSignIn(code: string, url: string): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailSignIn"

  const props = generateProps(code, url)
  const generatedResult = await apiGenerateEmailLoginCode(props) // TODO: Use sign in specific generator

  return createError(op, "not implemented yet")
}

export async function apiGenerateEmailLoginCode(props: LoginCodeV1Type): PromiseResult<SuccessResponseType> {
  const op = "apiGenerateEmailLoginCodeV1"
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
