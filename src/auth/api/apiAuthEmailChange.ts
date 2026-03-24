import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.js"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.js"
import type { UserEmailChangeTypePublic } from "#src/auth/convex/user/email_change/userEmailChange1RequestAction.js"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.js"

export async function apiAuthEmailChange(props: UserEmailChangeTypePublic) {
  return apiAuthFetch("apiAuthEmailChange", apiAuthBasePath + apiPathAuth.emailChangeRequest, props)
}
