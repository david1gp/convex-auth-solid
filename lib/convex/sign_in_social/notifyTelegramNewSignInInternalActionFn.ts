import { type ActionCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { sendTelegramMessageTechnical } from "~auth/convex/sign_in_social/sendTelegramMessageTechnical"
import { publicEnvVariableName } from "~auth/env/publicEnvVariableName"
import { userSessionValidator } from "~auth/model/userSessionValidator"
import { readEnvVariable } from "~utils/env/readEnvVariable"

export const notifyTelegramNewSignUpArgsValidator = v.object({
  userSession: userSessionValidator,
})

export type NotifyTelegramNewSignUpArgsType = typeof notifyTelegramNewSignUpArgsValidator.type

export async function notifyTelegramNewSignInInternalActionFn(
  ctx: ActionCtx,
  args: NotifyTelegramNewSignUpArgsType,
): Promise<void> {
  const envMode = readEnvVariable(publicEnvVariableName.PUBLIC_ENV_MODE)
  const name = envMode + " / user signed up"
  const data = args.userSession
  await sendTelegramMessageTechnical(name, data)
}
