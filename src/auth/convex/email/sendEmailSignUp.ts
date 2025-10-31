import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageTechnical } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailSignUpV1,
  type GeneratedEmailType,
  type SignUpV1Type,
} from "@adaptive-sm/email-generator/index.js"
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

  const props: SignUpV1Type = {
    // l: "en",
    ...generateSharedEmailProps(),
    code,
    url,
  }
  const generatedResult = await apiGenerateRegisterEmail(props)

  return createError(op, "not implemented yed")
}

export async function apiGenerateRegisterEmail(props: SignUpV1Type): PromiseResult<GeneratedEmailType> {
  const baseUrlResult = readEnvVariableResult(privateEnvVariableName.BASE_URL_EMAIL_GENERATOR)
  if (!baseUrlResult.success) return baseUrlResult
  return apiGenerateEmailSignUpV1(props, baseUrlResult.data)
}
