import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.js"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.js"
import type { UserEmailChangeConfirmTypePublic } from "#src/auth/convex/user/email_change/userEmailChange2ConfirmMutation.js"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.js"

export async function apiAuthEmailChangeConfirm(props: UserEmailChangeConfirmTypePublic) {
  return apiAuthFetch("apiAuthEmailChangeConfirm", apiAuthBasePath + apiPathAuth.emailChangeConfirm, props)
}
