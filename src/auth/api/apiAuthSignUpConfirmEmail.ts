import { envBaseUrlApiResult } from "@/app/env/public/envBaseUrlApiResult"
import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { tryParsingFetchErr } from "@/auth/api/tryParsingFetchErr"
import type { SignInViaEmailEnterOtpType } from "@/auth/model/signInSchema"
import type { UserSession } from "@/auth/model/UserSession"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import { type Result } from "~utils/result/Result"
import { parseUserSessionResponse } from "./parseUserSessionResponse"

export async function apiAuthSignUpConfirmEmail(props: SignInViaEmailEnterOtpType): Promise<Result<UserSession>> {
  const op = "apiClientSignUpConfirmEmail"

  const baseUrlResult = envBaseUrlApiResult()
  if (!baseUrlResult.success) return baseUrlResult
  const baseUrl = baseUrlResult.data

  const response = await fetch(baseUrl + apiAuthBasePath + apiPathAuth.signUpConfirmEmail, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(props),
  })
  const text = await response.text()
  if (!response.ok) {
    return tryParsingFetchErr(op, text, response.status, response.statusText)
  }
  return parseUserSessionResponse(op, text)
}
