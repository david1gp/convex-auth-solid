import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.js"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.js"
import type { SignInViaEmailType } from "#src/auth/model/signInSchema.js"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.js"

export async function apiAuthSignInViaEmail(props: SignInViaEmailType) {
  return apiAuthFetch("apiClientSignInViaEmail", apiAuthBasePath + apiPathAuth.signInViaEmail, props)
}
