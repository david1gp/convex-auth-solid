import { commonApiErrorMessages } from "@/auth/convex/sign_up/commonApiErrorMessages"
import type { UserSession } from "@/auth/model/UserSession"
import { signInViaEmailEnterOtpSchema } from "@/auth/model/signInSchema"
import { internal } from "@convex/_generated/api"
import { type ActionCtx } from "@convex/_generated/server"
import * as v from "valibot"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { createError } from "~utils/result/Result"
import { base64urlEncodeObject } from "~utils/url/base64url"

export async function signInViaEmailEnterOtp1RequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "signInViaEmailEnterOtp1RequestHandler"

  //
  // 1. validate request
  //
  if (request.method !== "POST") {
    return new Response(commonApiErrorMessages.methodNotAllowed, { status: 405 })
  }

  const textBody = await request.text()
  if (!textBody) {
    const errorMessage = commonApiErrorMessages.emptyBody
    const errorResult = createError(op, errorMessage, textBody)
    console.error(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }
  const schema = v.pipe(v.string(), v.parseJson(), signInViaEmailEnterOtpSchema)
  const validation = v.safeParse(schema, textBody)
  if (!validation.success) {
    const errorMessage = commonApiErrorMessages.schemaValidationFailed + ": " + v.summarize(validation.issues)
    const errorResult = createError(op, errorMessage, textBody)
    console.error(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  const { email, code } = validation.output

  //
  // 2. mutation: read db and validate data
  //
  const mutationResult = await ctx.runMutation(internal.auth.signInViaEmailEnterOtp2InternalMutation, { email, code })

  if (!mutationResult.success) {
    const errorResult = mutationResult
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }
  const userSession: UserSession = mutationResult.data

  //
  // 3. Schedule cleanup
  //
  await ctx.scheduler.runAfter(0, internal.auth.signInViaEmailEnterOtp3CleanupOldCodesInternalMutation, {})

  //
  // 4. Return result
  //
  const userSessionSerializedResult = base64urlEncodeObject(userSession)
  if (!userSessionSerializedResult.success) {
    console.error(op, userSessionSerializedResult.errorMessage)
    return new Response(jsonStringifyPretty(userSessionSerializedResult), { status: 400 })
  }

  return new Response(jsonStringifyPretty(userSession))
}
