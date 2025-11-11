import { envBaseUrlAppResult } from "@/app/env/public/envBaseUrlAppResult"
import { signInViaEmailSchema } from "@/auth/model/signInSchema"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import * as a from "valibot"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { createError } from "~utils/result/Result"
import { sendEmailSignIn } from "../email/sendEmailSignIn"
import { commonApiErrorMessages } from "../sign_up/commonApiErrorMessages"

export async function signInViaEmail1RequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "signInEmail1HttpHandler"

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
  const schema = a.pipe(a.string(), a.parseJson(), signInViaEmailSchema)
  const validation = a.safeParse(schema, textBody)
  if (!validation.success) {
    const errorMessage = commonApiErrorMessages.schemaValidationFailed + ": " + a.summarize(validation.issues)
    const errorResult = createError(op, errorMessage, textBody)
    console.error(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  const { email } = validation.output

  // Run mutation to save code
  const codeResult = await ctx.runMutation(internal.auth.signInViaEmail2InternalMutation, { email })
  if (!codeResult.success) {
    const errorResult = codeResult
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  const code = codeResult.data

  const baseUrlAppResult = envBaseUrlAppResult()
  if (!baseUrlAppResult.success) {
    console.error(op, baseUrlAppResult)
    return new Response(jsonStringifyPretty(baseUrlAppResult), { status: 500 })
  }
  const baseUrlApp = baseUrlAppResult.data

  // Send email
  const confirmUrl = new URL(pageRouteAuth.signInEnterOtp, baseUrlApp)
  confirmUrl.searchParams.set("email", email)
  confirmUrl.searchParams.set("code", code)
  await sendEmailSignIn(email, code, confirmUrl.toString())

  return new Response("Sign in code sent", { status: 200 })
}
