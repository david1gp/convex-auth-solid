import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.js"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.js"
import type { UserPasswordChange1RequestTypePublic } from "#src/auth/convex/user/pw_change/userPasswordChange1RequestAction.js"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.js"

export async function apiAuthPasswordChange(props: UserPasswordChange1RequestTypePublic) {
  return apiAuthFetch("apiClientChangePassword", apiAuthBasePath + apiPathAuth.passwordChangeRequest, props)
}
