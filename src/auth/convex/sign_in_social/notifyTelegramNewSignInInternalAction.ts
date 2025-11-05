import { publicEnvVariableName } from "@/app/env/publicEnvVariableName"
import { sendTelegramMessageTechnical } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import { userSessionValidator } from "@/auth/model/userSessionValidator"
import { type ActionCtx, internalAction } from "@convex/_generated/server"
import { v } from "convex/values"
import { readEnvVariable } from "~utils/env/readEnvVariable"

export const notifyTelegramNewSignUpArgsValidator = v.object({
  userSession: userSessionValidator,
})

export type NotifyTelegramNewSignUpArgsType = typeof notifyTelegramNewSignUpArgsValidator.type

export const notifyTelegramNewSignInInternalAction = internalAction({
  args: notifyTelegramNewSignUpArgsValidator,
  handler: notifyTelegramNewSignInInternalActionFn,
})

export async function notifyTelegramNewSignInInternalActionFn(
  ctx: ActionCtx,
  args: NotifyTelegramNewSignUpArgsType,
): Promise<void> {
  const envMode = readEnvVariable(publicEnvVariableName.PUBLIC_ENV_MODE)
  const name = envMode + " / user signed up"
  const data = args.userSession
  await sendTelegramMessageTechnical(name, data)
}
