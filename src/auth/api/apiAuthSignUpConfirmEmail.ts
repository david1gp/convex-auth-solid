import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import { userSessionSchema } from "@/auth/model/UserSession"
import type { SignInViaEmailEnterOtpType } from "@/auth/model/signInSchema"
import { apiPathAuth } from "@/auth/url/apiPathAuth"

export async function apiAuthSignUpConfirmEmail(props: SignInViaEmailEnterOtpType) {
  return apiAuthFetch(
    "apiClientSignUpConfirmEmail",
    apiAuthBasePath + apiPathAuth.signUpConfirmEmail,
    props,
    userSessionSchema,
  )
}
