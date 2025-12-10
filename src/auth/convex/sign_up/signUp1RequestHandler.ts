import { envBaseUrlAppResult } from "@/app/env/public/envBaseUrlAppResult"
import { generateOtpCode } from "@/auth/convex/pw/generateOtpCode"
import { hashPassword2 } from "@/auth/convex/pw/hashPassword"
import { signUpErrorMessages } from "@/auth/convex/sign_up/signUpErrorMessages"
import { signUpSchema } from "@/auth/model/signUpSchema"
import { pageRouteAuth } from "@/auth/url/pageRouteAuth"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import * as a from "valibot"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { createError } from "~utils/result/Result"
import { sendEmailSignUp } from "../email/sendEmailSignUp"
import { commonApiErrorMessages } from "./commonApiErrorMessages"

export async function signUp1RequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "signUp1RequestHandler"

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
  const schema = a.pipe(a.string(), a.parseJson(), signUpSchema)
  const validation = a.safeParse(schema, textBody)
  if (!validation.success) {
    const errorMessage = commonApiErrorMessages.schemaValidationFailed + ": " + a.summarize(validation.issues)
    const errorResult = createError(op, errorMessage, textBody)
    console.error(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }
  const { name, email, pw } = validation.output

  const existingUser = await ctx.runQuery(internal.auth.findUserByEmailInternalQuery, { email })
  if (existingUser) {
    const errorMessage = signUpErrorMessages.userAlreadyExists
    const errorResult = createError(op, errorMessage, email)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 409 })
  }

  const hashedPasswordResult = await hashPassword2(pw)
  if (!hashedPasswordResult.success) {
    console.warn(hashedPasswordResult)
    return new Response(jsonStringifyPretty(hashedPasswordResult), { status: 500 })
  }
  const hashedPassword = hashedPasswordResult.data

  const code = generateOtpCode()

  // Run mutation to save code
  await ctx.runMutation(internal.auth.signUp2InternalMutation, {
    name,
    email,
    hashedPassword,
    code,
  })

  // Send email
  const hostnameAppResult = envBaseUrlAppResult()
  if (!hostnameAppResult.success) {
    console.error(hostnameAppResult)
    return new Response(jsonStringifyPretty(hostnameAppResult), { status: 500 })
  }
  const hostnameApp = hostnameAppResult.data
  const confirmUrl = new URL(pageRouteAuth.signUpConfirmEmail, hostnameApp)
  confirmUrl.searchParams.set("email", email)
  confirmUrl.searchParams.set("code", code)
  await sendEmailSignUp(name, email, code, confirmUrl.toString())

  return new Response("Sign up code sent", { status: 200 })
}
