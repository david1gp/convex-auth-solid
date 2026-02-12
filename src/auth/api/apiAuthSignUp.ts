import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import type { SignUpType } from "@/auth/model/signUpSchema"
import { apiPathAuth } from "@/auth/url/apiPathAuth"

export async function apiAuthSignUp(props: SignUpType) {
  return apiAuthFetch("apiClientSignUp", apiAuthBasePath + apiPathAuth.signUp, props)
}
