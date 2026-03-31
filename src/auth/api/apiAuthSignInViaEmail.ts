import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.ts"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.ts"
import type { SignInViaEmailType } from "#src/auth/model/signInSchema.ts"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.ts"

export async function apiAuthSignInViaEmail(props: SignInViaEmailType) {
  return apiAuthFetch("apiClientSignInViaEmail", apiAuthBasePath + apiPathAuth.signInViaEmail, props)
}
