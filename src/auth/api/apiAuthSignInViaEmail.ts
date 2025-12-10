import { envBaseUrlApiResult } from "@/app/env/public/envBaseUrlApiResult"
import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import type { SignInViaEmailType } from "@/auth/model/signInSchema"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import { resultTryParsingFetchErr } from "@/utils/result/resultTryParsingFetchErr"
import { type Result, createResult } from "~utils/result/Result"

export async function apiAuthSignInViaEmail(props: SignInViaEmailType): Promise<Result<string>> {
  const op = "apiClientSignInViaEmail"

  const baseUrlResult = envBaseUrlApiResult()
  if (!baseUrlResult.success) return baseUrlResult
  const baseUrl = baseUrlResult.data

  const response = await fetch(baseUrl + apiAuthBasePath + apiPathAuth.signInViaEmail, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(props),
  })
  const text = await response.text()
  if (!response.ok) {
    console.error(op, response.status, response.statusText, text)
    return resultTryParsingFetchErr(op, text, response.status, response.statusText)
  }
  return createResult(text)
}
