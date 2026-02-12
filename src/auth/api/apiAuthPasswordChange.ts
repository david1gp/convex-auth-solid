import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import type { UserPasswordChangeTypePublic } from "@/auth/convex/user/update/userPasswordChangeMutation"

export async function apiAuthPasswordChange(props: UserPasswordChangeTypePublic) {
  return apiAuthFetch("apiAuthPasswordChange", apiAuthBasePath + apiPathAuth.passwordChange, props)
}
