import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import * as v from "valibot"
import { privateEnvVariableName } from "~auth/env/privateEnvVariableName"
import { loginMethod } from "~auth/model/loginMethod"
import { signInViaPwSchema } from "~auth/model/signInSchema"
import type { UserSession } from "~auth/model/UserSession"
import { createToken } from "~auth/server/jwt_token/createToken"
import { nowIso } from "~utils/date/nowIso"
import { readEnvVariableResult } from "~utils/env/readEnvVariable"
import { createError } from "~utils/result/Result"
import { dbUsersToUserProfile } from "../crud/dbUsersToUserProfile"
import type { IdUser } from "../IdUser"
import { verifyHashedPassword2 } from "../pw/verifyHashedPassword"

export async function signInViaPw1RequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "signInPw1HttpHandler"

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const body = await request.text()
  if (!body) {
    const errorMessage = "body is emtpy"
    const errorResult = createError(op, errorMessage, body)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }
  const schema = v.pipe(v.string(), v.parseJson(), signInViaPwSchema)
  const validation = v.safeParse(schema, body)
  if (!validation.success) {
    const errorMessage = "schema validation failed: " + v.summarize(validation.issues)
    const errorResult = createError(op, errorMessage, body)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  const { email, pw } = validation.output

  // Find user by email
  const user = await ctx.runQuery(internal.auth.findUserByEmailQuery, { email })
  if (!user) {
    const errorMessage = "User not found"
    const errorResult = createError(op, errorMessage, email)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 404 })
  }

  // Verify password
  if (!user.hashedPassword) {
    const errorMessage = "Password not set"
    const errorResult = createError(op, errorMessage, email)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  const pwVerifyResult = await verifyHashedPassword2(pw, user.hashedPassword)
  if (!pwVerifyResult.success) {
    const errorMessage = "Invalid password"
    const errorResult = createError(op, errorMessage)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 401 })
  }

  // Create token
  const saltResult = readEnvVariableResult(privateEnvVariableName.AUTH_SECRET)
  if (!saltResult.success) {
    const errorResult = saltResult
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 500 })
  }
  const salt = saltResult.data
  const token = await createToken(user._id, salt)
  // Insert session
  const expiresAt = await ctx.runMutation(internal.auth.authSessionInsertInternalMutation, {
    userId: user._id as IdUser,
    loginMethod: loginMethod.password,
    token,
  })

  // Create user profile
  const userProfile = dbUsersToUserProfile(user)

  // Create user session
  const userSession: UserSession = {
    token,
    user: userProfile,
    signedInMethod: loginMethod.password,
    signedInAt: nowIso(),
    expiresAt,
  }

  return new Response(JSON.stringify(userSession), { status: 200 })
}
