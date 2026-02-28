import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { apiAuthFetch } from "@/auth/api/apiAuthFetch"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"

export async function apiAuthUserDelete() {
  const token = userTokenGet()
  return apiAuthFetch("apiClientUserDelete", apiAuthBasePath + apiPathAuth.userDelete, { token })
}
