import { envEnvModeResult } from "@/app/env/public/envEnvModeResult"
import { sendTelegramMessageAuth } from "@/auth/convex/telegram/sendTelegramMessageTechnical"
import { userSessionValidator } from "@/auth/model/userSessionValidator"
import { type ActionCtx, internalAction } from "@convex/_generated/server"
import { v } from "convex/values"
import { envMode } from "~ui/env/envMode"
import { createResult, type PromiseResult } from "~utils/result/Result"

export const notifyTelegramAuthValidator = v.object({
  userSession: userSessionValidator,
  operationName: v.string(),
})

export type NotifyTelegramAuthValidatorType = typeof notifyTelegramAuthValidator.type

export const notifyTelegramAuthInternalAction = internalAction({
  args: notifyTelegramAuthValidator,
  handler: notifyTelegramAuthActionFn,
})

export async function notifyTelegramAuthActionFn(
  ctx: ActionCtx,
  args: NotifyTelegramAuthValidatorType,
): PromiseResult<null> {
  const envModeResult = envEnvModeResult()
  if (!envModeResult.success) return envModeResult
  if (envModeResult.data === envMode.development) return createResult(null)
  const name = envModeResult.data + " / " + args.operationName
  const { token, ...data } = args.userSession
  await sendTelegramMessageAuth(name, data)
  return createResult(null)
}
