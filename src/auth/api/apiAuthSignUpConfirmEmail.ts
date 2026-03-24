import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.js"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.js"
import { userSessionSchema } from "#src/auth/model/UserSession.js"
import type { SignInViaEmailEnterOtpType } from "#src/auth/model/signInSchema.js"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.js"

export async function apiAuthSignUpConfirmEmail(props: SignInViaEmailEnterOtpType) {
  return apiAuthFetch(
    "apiClientSignUpConfirmEmail",
    apiAuthBasePath + apiPathAuth.signUpConfirmEmail,
    props,
    userSessionSchema,
  )
}
