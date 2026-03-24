import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.js"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.js"
import type { UserProfileFieldsTypePublic } from "#src/auth/convex/user/profile_update/userProfileUpdateMutation.js"
import { userSessionSchema } from "#src/auth/model/UserSession.js"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.js"

export async function apiAuthProfileUpdate(props: UserProfileFieldsTypePublic) {
  return apiAuthFetch("apiAuthProfileUpdate", apiAuthBasePath + apiPathAuth.profileUpdate, props, userSessionSchema)
}
