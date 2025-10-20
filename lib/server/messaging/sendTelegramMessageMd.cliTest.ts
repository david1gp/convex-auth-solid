import { privateEnvVariableName } from "~auth/env/privateEnvVariableName"
import { readEnvVariableOrThrow } from "~utils/env/readEnvVariable"
import { sendTelegramMessageMd } from "./sendTelegramMessage"

const telegramChatId = readEnvVariableOrThrow(privateEnvVariableName.TELEGRAM_CHAT_ID)
const telegramTopicId = readEnvVariableOrThrow(privateEnvVariableName.TELEGRAM_TOPIC_ID)

/**
 * https://core.telegram.org/bots/api#sendmessage
 */
const exampleText1 = `
*bold \\*text*
_italic \\*text_
__underline__
~strikethrough~
||spoiler||
*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
![👍](tg://emoji?id=5368324170671202286)
\`inline fixed-width code\`
\`\`\`
pre-formatted fixed-width code block
\`\`\`
\`\`\`python
pre-formatted fixed-width code block written in the Python programming language
\`\`\`
>Block quotation started
>Block quotation continued
>The last line of the block quotation**
>The second block quotation started right after the previous\\r
>The third block quotation started right after the previous
`

async function main() {
  const exampleText2 = "hello world\n*bold*3\n\nsome text 123 \\!"
  const got = await sendTelegramMessageMd(exampleText2, telegramChatId, telegramTopicId)
  console.log("got:", got)
}
main()
