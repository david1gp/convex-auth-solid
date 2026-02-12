import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import { userSessionSchema } from "@/auth/model/UserSession"
import type { SignInViaPwType } from "@/auth/model/signInSchema"
import { apiPathAuth } from "@/auth/url/apiPathAuth"

export async function apiAuthSignInViaPw(props: SignInViaPwType) {
  return apiAuthFetch("apiClientSignInViaPw", apiAuthBasePath + apiPathAuth.signInViaPw, props, userSessionSchema)
}
