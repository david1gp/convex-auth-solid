import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import { sendTelegramMessageTechnical } from "@/auth/convex/sign_in_social/sendTelegramMessageTechnical"
import { userSessionValidator } from "@/auth/model/userSessionValidator"
import { type ActionCtx, internalAction } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, type PromiseResult } from "~utils/result/Result"

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
): PromiseResult<null> {
  const envModeResult = envEnvModeResult()
  if (!envModeResult.success) return envModeResult
  const name = envModeResult.data + " / user signed up"
  const data = args.userSession
  await sendTelegramMessageTechnical(name, data)
  return createResult(null)
}
