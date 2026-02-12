import { commonApiErrorMessages } from "@/auth/convex/sign_up/commonApiErrorMessages"
import { signInViaPwSchema } from "@/auth/model/signInSchema"
import type { UserSession } from "@/auth/model/UserSession"
import { loginMethod } from "@/auth/model_field/loginMethod"
import { createTokenResult } from "@/auth/server/jwt_token/createTokenResult"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import * as a from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createError } from "~utils/result/Result"
import type { IdUser } from "@/auth/convex/IdUser"
import { verifyHashedPassword2 } from "@/auth/convex/pw/verifyHashedPassword"
import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"

export async function signInViaPw1RequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "signInPw1HttpHandler"

  if (request.method !== "POST") {
    return new Response(commonApiErrorMessages.methodNotAllowed, { status: 405 })
  }

  const body = await request.text()
  if (!body) {
    const errorMessage = commonApiErrorMessages.emptyBody
    const errorResult = createError(op, errorMessage, body)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }
  const schema = a.pipe(a.string(), a.parseJson(), signInViaPwSchema)
  const validation = a.safeParse(schema, body)
  if (!validation.success) {
    const errorMessage = commonApiErrorMessages.schemaValidationFailed + ": " + a.summarize(validation.issues)
    const errorResult = createError(op, errorMessage, body)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  const { email, pw } = validation.output

  // Find user by email
  const user = await ctx.runQuery(internal.auth.findUserByEmailInternalQuery, { email })
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

  // Check for org membership
  const { orgHandle, orgRole } = await ctx.runQuery(internal.org.getOrgMemberHandleAndRoleInternalQuery, {
    userId: user._id as IdUser,
  })

  // Create token
  const tokenResult = await createTokenResult(user._id, orgHandle, orgRole)
  if (!tokenResult.success) {
    const errorResult = tokenResult
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 500 })
  }
  const token = tokenResult.data

  // Insert session
  const expiresAt = await ctx.runMutation(internal.auth.authSessionInsertInternalMutation, {
    userId: user._id as IdUser,
    loginMethod: loginMethod.password,
    token,
  })

  // Create user profile
  const userProfile = docUserToUserProfile(user, orgHandle, orgRole)

  // Create user session
  const userSession: UserSession = {
    token,
    profile: userProfile,
    hasPw: !!user.hashedPassword,
    signedInMethod: loginMethod.password,
    signedInAt: nowIso(),
    expiresAt,
  }

  return new Response(JSON.stringify(userSession), { status: 200 })
}
