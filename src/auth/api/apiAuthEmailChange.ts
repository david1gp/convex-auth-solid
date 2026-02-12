import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import type { UserEmailChangeTypePublic } from "@/auth/convex/user/update/userEmailChangeMutation"

export async function apiAuthEmailChange(props: UserEmailChangeTypePublic) {
  return apiAuthFetch("apiAuthEmailChange", apiAuthBasePath + apiPathAuth.emailChange, props)
}
