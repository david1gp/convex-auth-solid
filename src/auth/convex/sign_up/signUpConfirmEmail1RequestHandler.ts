import { commonApiErrorMessages } from "@/auth/convex/sign_up/commonApiErrorMessages"
import type { UserSession } from "@/auth/model/UserSession"
import { signUpConfirmEmailSchema } from "@/auth/model/signUpConfirmEmailSchema"
import { internal } from "@convex/_generated/api"
import { type ActionCtx } from "@convex/_generated/server"
import * as a from "valibot"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { base64urlEncodeObject } from "~utils/url/base64url"

export async function signUpConfirmEmail1RequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "signUpConfirmEmail1HttpHandler"

  //
  // 1. validate request
  //
  if (request.method !== "POST") {
    return new Response(commonApiErrorMessages.methodNotAllowed, { status: 405 })
  }
  const textBody = await request.text()
  if (!textBody) {
    const errorMessage = commonApiErrorMessages.emptyBody
    console.warn(op, errorMessage, textBody)
    return new Response(JSON.stringify({ errorMessage }), { status: 400 })
  }
  const schema = a.pipe(a.string(), a.parseJson(), signUpConfirmEmailSchema)
  const validation = a.safeParse(schema, textBody)
  if (!validation.success) {
    const errorMessage = commonApiErrorMessages.schemaValidationFailed + ": " + a.summarize(validation.issues)
    console.warn(op, errorMessage)
    return new Response(JSON.stringify({ errorMessage }), { status: 400 })
  }

  const { email, code } = validation.output

  //
  // 2. mutation: read db and validate data
  //
  const mutationResult = await ctx.runMutation(internal.auth.signUpConfirmEmail2InternalMutation, { email, code })

  if (!mutationResult.success) {
    const errorResult = mutationResult
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }
  const userSession: UserSession = mutationResult.data

  //
  // 3. Schedule cleanup
  //
  await ctx.scheduler.runAfter(0, internal.auth.signUpConfirmEmail3CleanupOldCodesInternalMutation, {})

  //
  // 4. Notify via Telegram
  //
  await ctx.scheduler.runAfter(0, internal.auth.notifyTelegramNewSignUpInternalAction, { userSession })

  //
  // 5. Return result
  //
  const userSessionSerializedResult = base64urlEncodeObject(userSession)
  if (!userSessionSerializedResult.success) {
    console.error(userSessionSerializedResult)
    return new Response(jsonStringifyPretty(userSessionSerializedResult), { status: 500 })
  }

  return new Response(JSON.stringify(userSession, null, 2))
}
