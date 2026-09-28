import { api } from "#convex/_generated/api.js"
import type { ResultErr } from "#result"
import type { DocUser } from "#src/auth/convex/IdUser.ts"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.ts"
import { queryCreate } from "#src/utils/convex_client/queryCreate.ts"

export function userProfileLoaderStateCreate(username: () => string) {
  const data = queryCreate(api.auth.userGetByUsernameQuery, { username: username() })
  return {
    loading: () => data() === undefined,
    missing: () => data() === null,
    error: () => {
      const value = data()
      if (!resultIsError(value)) return ""
      return value.errorMessage || "Error loading user profile"
    },
    profile: () => {
      const value = data()
      if (!value || resultIsError(value)) return null
      return docUserToUserProfile(value)
    },
  }
}

function resultIsError(value: DocUser | ResultErr | null | undefined): value is ResultErr {
  return value !== null && typeof value === "object" && "success" in value && value.success === false
}
