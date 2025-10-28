import { getBaseUrlApp } from "@/app/url/getBaseUrl"
import { signInViaEmailSchema } from "@/auth/model/signInSchema"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import * as v from "valibot"
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
  const schema = v.pipe(v.string(), v.parseJson(), signInViaEmailSchema)
  const validation = v.safeParse(schema, textBody)
  if (!validation.success) {
    const errorMessage = commonApiErrorMessages.schemaValidationFailed + ": " + v.summarize(validation.issues)
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

  const hostnameApp = getBaseUrlApp()
  if (!hostnameApp) {
    const errorMessage = "!env.HOSTNAME_APP"
    console.error(op, errorMessage)
    return new Response(errorMessage, { status: 500 })
  }

  // Send email
  const confirmUrl = new URL(pageRouteAuth.signInEnterOtp, hostnameApp)
  confirmUrl.searchParams.set("email", email)
  confirmUrl.searchParams.set("code", code)
  await sendEmailSignIn(email, code, confirmUrl.toString())

  return new Response("Sign in code sent", { status: 200 })
}
