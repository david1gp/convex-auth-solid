import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import type { UserPasswordChange1RequestTypePublic } from "@/auth/convex/user/pw_change/userPasswordChange1RequestAction"
import { apiPathAuth } from "@/auth/url/apiPathAuth"

export async function apiAuthPasswordChange(props: UserPasswordChange1RequestTypePublic) {
  return apiAuthFetch("apiClientChangePassword", apiAuthBasePath + apiPathAuth.passwordChangeRequest, props)
}
