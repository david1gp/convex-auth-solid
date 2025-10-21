import { internal } from "@convex/_generated/api"
import { type ActionCtx } from "@convex/_generated/server"
import * as v from "valibot"
import type { UserSession } from "~auth/model/UserSession"
import { signInViaEmailEnterOtpSchema } from "~auth/model/signInSchema"
import { createError } from "~utils/result/Result"
import { base64urlEncodeObject } from "~utils/url/base64url"

export async function signInViaEmailEnterOtp1RequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "signInViaEmailEnterOtp1RequestHandler"

  //
  // 1. validate request
  //
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const textBody = await request.text()
  if (!textBody) {
    const errorMessage = "Empty body"
    const errorResult = createError(op, errorMessage, textBody)
    console.error(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }
  const schema = v.pipe(v.string(), v.parseJson(), signInViaEmailEnterOtpSchema)
  const validation = v.safeParse(schema, textBody)
  if (!validation.success) {
    const errorMessage = "Schema validation failed: " + v.summarize(validation.issues)
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
  await ctx.scheduler.runAfter(
    0,
    internal.auth.sign_in_email.signInViaEmailEnterOtp3CleanupOldCodesInternalMutation
      .signInViaEmailEnterOtp3CleanupOldCodesInternalMutation,
    {},
  )

  //
  // 4. Return result
  //
  const userSessionSerializedResult = base64urlEncodeObject(userSession)
  if (!userSessionSerializedResult.success) {
    throw new Error(userSessionSerializedResult.errorMessage)
  }

  return new Response(JSON.stringify(userSession, null, 2))
}
