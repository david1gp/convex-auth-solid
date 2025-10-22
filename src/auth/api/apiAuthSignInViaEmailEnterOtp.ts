import { getBaseUrlApi } from "@/app/url/getBaseUrl"
import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import type { SignInViaEmailEnterOtpType } from "@/auth/model/signInSchema"
import type { UserSession } from "@/auth/model/UserSession"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import { type Result, createError } from "~utils/result/Result"
import { parseUserSessionResponse } from "./parseUserSessionResponse"

export async function apiAuthSignInViaEmailEnterOtp(props: SignInViaEmailEnterOtpType): Promise<Result<UserSession>> {
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
