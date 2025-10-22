import { getBaseUrlApi } from "@/app/url/getBaseUrl"
import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import type { SignInViaEmailType } from "@/auth/model/signInSchema"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import { type Result, createError, createResult } from "~utils/result/Result"

export async function apiAuthSignInViaEmail(props: SignInViaEmailType): Promise<Result<string>> {
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
