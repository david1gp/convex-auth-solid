import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { generateSharedEmailProps } from "@/auth/convex/email/generateSharedEmailProps"
import { sendTelegramMessageTechnical } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import {
  apiGenerateEmailSignInV1,
  type GeneratedEmailType,
  type SignInV1Type,
} from "@adaptive-sm/email-generator/index.js"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { type PromiseResult } from "~utils/result/Result"

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
  const props: SignInV1Type = {
    // l: "en",
    ...generateSharedEmailProps(),
    code,
    url,
  }
  const baseUrlResult = readEnvVariableResult(privateEnvVariableName.BASE_URL_EMAIL_GENERATOR)
  if (!baseUrlResult.success) return baseUrlResult
  return apiGenerateEmailSignInV1(props, baseUrlResult.data)
}
