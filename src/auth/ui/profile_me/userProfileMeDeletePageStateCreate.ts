import { ttc } from "#src/app/i18n/ttc.ts"
import { apiAuthUserDelete } from "#src/auth/api_client/apiAuthUserDelete.ts"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { profileMeResultNotify } from "./profileMeResultNotify.ts"
import { userProfileMeDeleteStateCreate } from "./userProfileMeDeleteStateCreate.ts"

export function userProfileMeDeletePageStateCreate() {
  return userProfileMeDeleteStateCreate(async () => {
    const result = await apiAuthUserDelete()
    profileMeResultNotify(result, ttc("Account deleted successfully"), ttc("Failed to delete account"))
    if (!result.success) return result
    userSessionSignal.set(null)
    navigateTo("/")
    return result
  })
}
