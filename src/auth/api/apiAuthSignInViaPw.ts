import { envBaseUrlApiResult } from "@/app/env/public/envBaseUrlApiResult"
import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import type { SignInViaPwType } from "@/auth/model/signInSchema"
import type { UserSession } from "@/auth/model/UserSession"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import { resultTryParsingFetchErr } from "@/utils/result/resultTryParsingFetchErr"
import { type Result } from "~utils/result/Result"
import { parseUserSessionResponse } from "./parseUserSessionResponse"

export async function apiAuthSignInViaPw(props: SignInViaPwType): Promise<Result<UserSession>> {
  const op = "apiClientSignInViaPw"

  const baseUrlResult = envBaseUrlApiResult()
  if (!baseUrlResult.success) return baseUrlResult
  const baseUrl = baseUrlResult.data

  const response = await fetch(baseUrl + apiAuthBasePath + apiPathAuth.signInViaPw, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(props),
  })
  const text = await response.text()
  if (!response.ok) {
    console.error(op, response.status, response.statusText, text)
    return resultTryParsingFetchErr(op, text, response.status, response.statusText)
  }
  return parseUserSessionResponse(op, text)
}
