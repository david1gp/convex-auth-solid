import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import type { SignInViaPwType } from "@/auth/model/signInSchema"
import type { UserSession } from "@/auth/model/UserSession"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import { type Result, createError } from "~utils/result/Result"
import { parseUserSessionResponse } from "./parseUserSessionResponse"

export async function apiAuthSignInViaPw(props: SignInViaPwType): Promise<Result<UserSession>> {
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
