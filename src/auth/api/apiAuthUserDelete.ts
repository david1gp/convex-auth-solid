import { apiAuthBasePath } from "#src/auth/api/apiAuthBasePath.js"
import { apiAuthFetch } from "#src/auth/api/apiAuthFetch.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import { apiPathAuth } from "#src/auth/url/apiPathAuth.js"

export async function apiAuthUserDelete() {
  const token = userTokenGet()
  return apiAuthFetch("apiClientUserDelete", apiAuthBasePath + apiPathAuth.userDelete, { token })
}
