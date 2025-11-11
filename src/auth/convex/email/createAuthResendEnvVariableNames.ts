import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import type { ResendEnvVariableNames } from "~utils/email/resend/sendEmailsViaResend"

export function createAuthResendEnvVariableNames(): ResendEnvVariableNames {
  return {
    apiKey: privateEnvVariableName.AUTH_RESEND_API_KEY,
    senderAddress: privateEnvVariableName.AUTH_RESEND_SENDER_ADDRESS,
    senderName: privateEnvVariableName.AUTH_RESEND_SENDER_NAME,
  }
}
