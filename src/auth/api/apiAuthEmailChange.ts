import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import type { UserEmailChangeTypePublic } from "@/auth/convex/user/email_change/userEmailChange1RequestAction"
import { apiPathAuth } from "@/auth/url/apiPathAuth"

export async function apiAuthEmailChange(props: UserEmailChangeTypePublic) {
  return apiAuthFetch("apiAuthEmailChange", apiAuthBasePath + apiPathAuth.emailChangeRequest, props)
}
