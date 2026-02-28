import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import type { UserEmailChangeConfirmTypePublic } from "@/auth/convex/user/email_change/userEmailChange2ConfirmMutation"
import { apiPathAuth } from "@/auth/url/apiPathAuth"

export async function apiAuthEmailChangeConfirm(props: UserEmailChangeConfirmTypePublic) {
  return apiAuthFetch("apiAuthEmailChangeConfirm", apiAuthBasePath + apiPathAuth.emailChangeConfirm, props)
}
