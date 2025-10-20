import type { PromiseResult } from "@adaptive-sm/email-generator"
import { privateEnvVariableName } from "~auth/env/privateEnvVariableName"
import { type TelegramMessageType, sendTelegramMessageHtml } from "~auth/server/messaging/sendTelegramMessage"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"

export async function sendTelegramMessageTechnical(
  name: string,
  data: any,
  disableNotification: boolean = true,
): PromiseResult<null> {
  const chatIdResult = readEnvVariableResult(privateEnvVariableName.TELEGRAM_CHAT_ID)
  if (!chatIdResult.success) return chatIdResult
  const chatId = chatIdResult.data

  const serialized = typeof data === "string" ? data : JSON.stringify(data, null, 2)
  const text = `
<b>${name}</b>
<pre><code class="json">${serialized}</code></pre>
`.trim()
  const telegramProps: TelegramMessageType = {
    text,
    chatId: chatId,
    // topicId: telegramTopicId.signUp,
    disableNotification,
  }
  const startedAt = Date.now()
  const got = await sendTelegramMessageHtml(telegramProps)
  const endedAt = Date.now()
  const durationMs = endedAt - startedAt
  const op = "notifyTelegramNewSignUpInternalAction"
  // console.log(op, userSession.user.name, userSession.user, got)
  console.log(op, "telegram api call:", got, durationMs, "ms")
  return got
}
