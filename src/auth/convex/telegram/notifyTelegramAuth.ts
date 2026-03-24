import { createResult, type PromiseResult } from "#result"
import { envEnvModeResult } from "#src/app/env/public/envEnvModeResult.js"
import { sendTelegramMessageAuth } from "#src/auth/convex/telegram/sendTelegramMessageTechnical.js"
import { userSessionValidator } from "#src/auth/model/userSessionValidator.js"
import { envMode } from "#ui/env/envMode"
import { type ActionCtx, internalAction } from "@convex/_generated/server.js"
import { v } from "convex/values"

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
