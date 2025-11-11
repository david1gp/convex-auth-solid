import { envBaseUrlApiResult } from "@/app/env/public/envBaseUrlApiResult"
import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { tryParsingFetchErr } from "@/auth/api/tryParsingFetchErr"
import type { SignUpType } from "@/auth/model/signUpSchema"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import { type Result, createResult } from "~utils/result/Result"

export async function apiAuthSignUp(props: SignUpType): Promise<Result<string>> {
  const op = "apiClientSignUp"

  const baseUrlResult = envBaseUrlApiResult()
  if (!baseUrlResult.success) return baseUrlResult
  const baseUrl = baseUrlResult.data

  const response = await fetch(baseUrl + apiAuthBasePath + apiPathAuth.signUp, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(props),
  })
  const text = await response.text()
  if (!response.ok) {
    return tryParsingFetchErr(op, text, response.status, response.statusText)
  }
  return createResult(text)
}
