import {
  apiGenerateEmailLoginCodeV1,
  type GeneratedEmailType,
  type LoginCodeV1Type,
  type RegisterEmailV1Type,
  type SuccessResponseType,
} from "@adaptive-sm/email-generator"
import { generateSharedEmailProps } from "~auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageTechnical } from "~auth/convex/sign_in_social/sendTelegramMessageTechnical"
import { privateEnvVariableName } from "~auth/env/privateEnvVariableName"
import { publicEnvVariableName } from "~auth/env/publicEnvVariableName"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createError, type PromiseResult } from "~utils/result/Result"
// TODO: Create apiGenerateSignInEmailV1 when email generator supports sign in templates

export async function sendEmailSignIn(email: string, code: string, url: string): PromiseResult<null> {
  // will be done later

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
