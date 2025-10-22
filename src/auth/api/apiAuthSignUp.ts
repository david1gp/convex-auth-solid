import { getBaseUrlApi } from "@/app/url/getBaseUrl"
import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import type { SignUpType } from "@/auth/model/signUpSchema"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import { type Result, createError, createResult } from "~utils/result/Result"

export async function apiAuthSignUp(props: SignUpType): Promise<Result<string>> {
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
