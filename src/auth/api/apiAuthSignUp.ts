import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.js"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.js"
import type { SignUpType } from "#src/auth/model/signUpSchema.js"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.js"

export async function apiAuthSignUp(props: SignUpType) {
  return apiAuthFetch("apiClientSignUp", apiAuthBasePath + apiPathAuth.signUp, props)
}
