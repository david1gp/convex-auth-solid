import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.ts"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.ts"
import { userSessionSchema } from "#src/auth/model/UserSession.ts"
import type { SignInViaPwType } from "#src/auth/model/signInSchema.ts"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.ts"

export async function apiAuthSignInViaPw(props: SignInViaPwType) {
  return apiAuthFetch("apiClientSignInViaPw", apiAuthBasePath + apiPathAuth.signInViaPw, props, userSessionSchema)
}
