import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import { userSessionSchema } from "@/auth/model/UserSession"
import type { UserProfileFieldsTypePublic } from "@/auth/convex/user/profile_update/userProfileUpdateMutation"
import { apiPathAuth } from "@/auth/url/apiPathAuth"

export async function apiAuthProfileUpdate(props: UserProfileFieldsTypePublic) {
  return apiAuthFetch("apiAuthProfileUpdate", apiAuthBasePath + apiPathAuth.profileUpdate, props, userSessionSchema)
}
