import * as v from "valibot"
import { apiAuthBasePath } from "~auth/api/apiAuthBasePath"
import type { SignInViaEmailEnterOtpType, SignInViaEmailType, SignInViaPwType } from "~auth/model/signInSchema"
import type { SignUpType } from "~auth/model/signUpSchema"
import { userSessionSchema, type UserSession } from "~auth/model/UserSession"
import { apiPathAuth } from "~auth/url/apiPathAuth"
import { getBaseUrlApi } from "~auth/url/getBaseUrl"
import { createError, createResult, type Result } from "~utils/result/Result"

export async function apiClientSignUp(props: SignUpType): Promise<Result<string>> {
  const op = "apiClientSignUp"
  const response = await fetch(getBaseUrlApi() + apiAuthBasePath + apiPathAuth.signUp, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(props),
  })
  const text = await response.text()
  if (!response.ok) {
    return createError(op, response.statusText, text)
  }
  return createResult(text)
}

export async function apiClientSignUpConfirmEmail(props: SignInViaEmailEnterOtpType): Promise<Result<UserSession>> {
  const op = "apiClientSignUpConfirmEmail"
  const response = await fetch(getBaseUrlApi() + apiAuthBasePath + apiPathAuth.signUpConfirmEmail, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(props),
  })
  const text = await response.text()
  if (!response.ok) {
    return createError(op, response.statusText, text)
  }
  return parseUserSessionResponse(op, text)
}

export async function apiClientSignInViaPw(props: SignInViaPwType): Promise<Result<UserSession>> {
  const op = "apiClientSignInViaPw"
  const response = await fetch(apiAuthBasePath + apiPathAuth.signInViaPw, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(props),
  })
  const text = await response.text()
  if (!response.ok) {
    return createError(op, response.statusText, text)
  }
  return parseUserSessionResponse(op, text)
}

export async function apiClientSignInViaEmail(props: SignInViaEmailType): Promise<Result<string>> {
  const op = "apiClientSignInViaEmail"
  const response = await fetch(getBaseUrlApi() + apiAuthBasePath + apiPathAuth.signInViaEmail, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(props),
  })
  const text = await response.text()
  if (!response.ok) {
    return createError(op, response.statusText, text)
  }
  return createResult(text)
}

export async function apiClientSignInViaEmailEnterOtp(props: SignInViaEmailEnterOtpType): Promise<Result<UserSession>> {
  const op = "apiClientSignInViaEmailEnterOtp"
  const response = await fetch(getBaseUrlApi() + apiAuthBasePath + apiPathAuth.signInViaEmailEnterOtp, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(props),
  })
  const text = await response.text()
  if (!response.ok) {
    return createError(op, response.statusText, text)
  }
  return parseUserSessionResponse(op, text)
}

function parseUserSessionResponse(op: string, text: string): Result<UserSession> {
  const schema = v.pipe(v.string(), v.parseJson(), userSessionSchema)
  const parsing = v.safeParse(schema, text)
  if (!parsing.success) {
    return createError(op, v.summarize(parsing.issues), text)
  }
  return createResult(parsing.output)
}
