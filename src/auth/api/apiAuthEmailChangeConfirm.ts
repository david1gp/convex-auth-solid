import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import type { UserEmailChangeConfirmTypePublic } from "@/auth/convex/user/update/userEmailChangeConfirmMutation"

export async function apiAuthEmailChangeConfirm(props: UserEmailChangeConfirmTypePublic) {
  return apiAuthFetch("apiAuthEmailChangeConfirm", apiAuthBasePath + apiPathAuth.emailChangeConfirm, props)
}
