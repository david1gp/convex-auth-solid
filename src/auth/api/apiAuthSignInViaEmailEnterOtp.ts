import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import { userSessionSchema } from "@/auth/model/UserSession"
import type { SignInViaEmailEnterOtpType } from "@/auth/model/signInSchema"
import { apiPathAuth } from "@/auth/url/apiPathAuth"

export async function apiAuthSignInViaEmailEnterOtp(props: SignInViaEmailEnterOtpType) {
  return apiAuthFetch(
    "apiClientSignInViaEmailEnterOtp",
    apiAuthBasePath + apiPathAuth.signInViaEmailEnterOtp,
    props,
    userSessionSchema,
  )
}
