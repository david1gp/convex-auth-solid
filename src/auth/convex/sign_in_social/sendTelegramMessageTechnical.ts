import { privateEnvVariableName } from "@/app/env/privateEnvVariableName"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import type { PromiseResult } from "~utils/result/Result"
import { sendTelegramMessageHtml, type TelegramEnvVariableNames } from "~utils/telegram/sendTelegramMessageHtml"

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
  const startedAt = Date.now()
  const telegramEnvVariables = {
    apiToken: privateEnvVariableName.TELEGRAM_TOKEN,
    chatId: privateEnvVariableName.TELEGRAM_CHAT_ID,
  } as const satisfies TelegramEnvVariableNames
  const got = await sendTelegramMessageHtml(text, telegramEnvVariables, disableNotification)
  const endedAt = Date.now()
  const durationMs = endedAt - startedAt
  const op = "sendTelegramMessageTechnical"
  // console.log(op, userSession.user.name, userSession.user, got)
  console.log(op, "telegram api call:", got, durationMs, "ms")
  return got
}
