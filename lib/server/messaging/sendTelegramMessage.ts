import * as v from "valibot"
import { privateEnvVariableName } from "~auth/env/privateEnvVariableName"
import { readEnvVariable } from "~utils/env/readEnvVariable"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"
import { intOrStringSchema } from "~utils/valibot/intOrStringSchema"

export const telegramBaseApiUrl = "https://api.telegram.org"

export type TelegramMessageParseMode = keyof typeof telegramMessageParseMode

export const telegramMessageParseMode = {
  markdown: "MarkdownV2",
  html: "HTML",
} as const

export type TelegramMessagePropsMd = {
  chatId: string | number
  text: string
}

/**
 * https://core.telegram.org/bots/api#markdownv2-style
 */
export async function sendTelegramMessageMd(
  text: string,
  chatId: string | number,
  topicId?: string | number,
  disableNotification?: boolean,
): PromiseResult<null> {
  return sendTelegramMessage({
    chat_id: chatId,
    message_thread_id: topicId,
    text,
    parse_mode: telegramMessageParseMode.markdown,
    disable_notification: disableNotification,
  })
}

export type TelegramMessageType = {
  chatId: string | number
  topicId?: string | number
  text: string
  disableNotification?: boolean
}

/**
 * https://core.telegram.org/bots/api#html-style
 */
export async function sendTelegramMessageHtml(p: TelegramMessageType): PromiseResult<null> {
  return sendTelegramMessage({
    chat_id: p.chatId,
    message_thread_id: p.topicId,
    text: p.text,
    parse_mode: telegramMessageParseMode.html,
    disable_notification: p.disableNotification,
  })
}

/**
 * https://core.telegram.org/bots/api#sendmessage
 * errors - https://core.telegram.org/method/messages.sendMessage#possible-errors
 */
export type TelegramMessageProps = {
  chat_id: string | number
  message_thread_id?: string | number
  text: string
  parse_mode: "MarkdownV2" | "HTML"
  link_preview_options?: TelegramLinkPreviewOptions
  disable_notification?: boolean
}

/**
 * https://core.telegram.org/bots/api#linkpreviewoptions
 */
export type TelegramLinkPreviewOptions = {
  is_disabled?: boolean
  url?: string
  prefer_small_media?: boolean
  prefer_large_media?: boolean
  show_above_text?: boolean
}

const defaults: Partial<TelegramMessageProps> = {
  link_preview_options: {
    is_disabled: true,
  },
}

// https://core.telegram.org/bots/api#formatting-options
const escapedChars = ["_", "*", "[", "]", "(", ")", "~", "`", ">", "#", "+", "-", "=", "|", "{", "}", ".", "!"]

function cleanText(text: string): string {
  let cleanedText = text
  for (const char of escapedChars) {
    cleanedText = cleanedText.replaceAll(char, `\\${char}`)
  }
  return cleanedText
}

export async function sendTelegramMessage(
  props: TelegramMessageProps,
  apiKey = readEnvVariable(privateEnvVariableName.TELEGRAM_TOKEN),
): PromiseResult<null> {
  const op = "sendTelegramMessage"
  if (!apiKey) return createError(op, "missing apiKey: TELEGRAM_TOKEN")
  // const filled: TelegramMessageProps = {
  //   ...defaults,
  //   ...props,
  // }
  // enable escaping
  // filled.text = filled.parse_mode === "MarkdownV2" ? cleanText(filled.text) : filled.text

  if (props.text.length <= 0) {
    return createError(op, "text length = 0")
  }

  if (props.text.length > 4096) {
    return createError(op, "text length to long: " + props.text.length + " > " + 4096)
  }

  // console.log(cleanedText)
  // console.log("sending")
  // console.log(filled)
  const url = `https://api.telegram.org/bot${apiKey}/sendMessage`
  const body = JSON.stringify(props)
  // console.log(url, body)

  const fetched = await fetch(url, {
    body: body,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  })
  const fetchText = await fetched.text()
  // console.log("api call", fetched.status, fetchText)
  if (fetched.ok) {
    return createResult(null)
  }
  const parsing = v.safeParse(errSchemaString, fetchText)
  if (!parsing.success) {
    return createError(op, v.summarize(parsing.issues), fetchText)
  }
  return createError(op, parsing.output.description)
}

const successSchema = v.object({
  ok: v.boolean(),
  // result
  // chat
  date: intOrStringSchema,
  text: v.string(),
  // entities
})

const errSchema = v.object({
  ok: v.boolean(),
  error_code: intOrStringSchema,
  description: v.string(),
})
const errSchemaString = v.pipe(v.string(), v.parseJson(), errSchema)
