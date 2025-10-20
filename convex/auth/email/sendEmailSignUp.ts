import {
  apiGenerateRegisterEmailV1,
  type GeneratedEmailType,
  type RegisterEmailV1Type,
  type SuccessResponseType,
} from "@adaptive-sm/email-generator"
import { generateSharedEmailProps } from "@convex/auth/email/generateSharedEmailProps"
import { sendTelegramMessageTechnical } from "@convex/auth/sign_in_social/sendTelegramMessageTechnical"
import { privateEnvVariableName } from "~auth/env/privateEnvVariableName"
import { publicEnvVariableName } from "~auth/env/publicEnvVariableName"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createError, type PromiseResult } from "~utils/result/Result"

export async function sendEmailSignUp(email: string, code: string, url: string): PromiseResult<null> {
  // will be done later
  const envModeResult = readEnvVariableResult(publicEnvVariableName.PUBLIC_ENV_MODE)
  if (!envModeResult.success) return envModeResult
  const envMode = envModeResult.data
  const name = envMode + " / user sign up"
  const data = { code, url, email }
  return await sendTelegramMessageTechnical(name, data)
}

export async function generateEmailSignUp(code: string, url: string): PromiseResult<GeneratedEmailType> {
  const op = "generateEmailSignUp"

  const props = generateProps(code, url)
  const generatedResult = await apiGenerateRegisterEmail(props)

  return createError(op, "not implemented yed")
}

export async function apiGenerateRegisterEmail(props: RegisterEmailV1Type): PromiseResult<SuccessResponseType> {
  const baseUrlResult = readEnvVariableResult(privateEnvVariableName.BASE_URL_EMAIL_GENERATOR)
  if (!baseUrlResult.success) return baseUrlResult
  return apiGenerateRegisterEmailV1(props, baseUrlResult.data)
}

function generateProps(code: string, url: string): RegisterEmailV1Type {
  const preset = {
    ...generateSharedEmailProps(),
    l: "en",
  } as const satisfies Partial<RegisterEmailV1Type>
  return { ...preset, code, url }
}
