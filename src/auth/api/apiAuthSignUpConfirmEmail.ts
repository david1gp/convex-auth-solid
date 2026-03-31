import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.ts"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.ts"
import { userSessionSchema } from "#src/auth/model/UserSession.ts"
import type { SignInViaEmailEnterOtpType } from "#src/auth/model/signInSchema.ts"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.ts"

export async function apiAuthSignUpConfirmEmail(props: SignInViaEmailEnterOtpType) {
  return apiAuthFetch(
    "apiClientSignUpConfirmEmail",
    apiAuthBasePath + apiPathAuth.signUpConfirmEmail,
    props,
    userSessionSchema,
  )
}
