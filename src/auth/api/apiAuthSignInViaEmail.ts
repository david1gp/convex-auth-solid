import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import type { SignInViaEmailType } from "@/auth/model/signInSchema"
import { apiPathAuth } from "@/auth/url/apiPathAuth"

export async function apiAuthSignInViaEmail(props: SignInViaEmailType) {
  return apiAuthFetch("apiClientSignInViaEmail", apiAuthBasePath + apiPathAuth.signInViaEmail, props)
}
