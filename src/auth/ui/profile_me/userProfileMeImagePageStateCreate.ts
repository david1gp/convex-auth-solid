import { ttc } from "#src/app/i18n/ttc.ts"
import { apiAuthProfileUpdate } from "#src/auth/api_client/apiAuthProfileUpdate.ts"
import { userSessionGet, userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"
import { userSessionsSignalAdd } from "#src/auth/ui/signals/userSessionsSignal.ts"
import { urlUserProfileMe } from "#src/auth/url/pageRouteAuth.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { profileMeResultNotify } from "./profileMeResultNotify.ts"
import { userProfileMeImageStateCreate } from "./userProfileMeImageStateCreate.ts"

export function userProfileMeImagePageStateCreate() {
  const session = userSessionGet()
  return userProfileMeImageStateCreate({
    initialImage: session.profile.image ?? "",
    save: async (image) => {
      const result = await apiAuthProfileUpdate({
        name: session.profile.name,
        image: image || undefined,
        token: session.token,
      })
      profileMeResultNotify(result, ttc("Profile Image Updated"), ttc("Update Failed"))
      if (!result.success) return result
      userSessionsSignalAdd(result.data)
      userSessionSignal.set(result.data)
      navigateTo(urlUserProfileMe())
      return result
    },
  })
}
