import { api } from "#convex/_generated/api.js"
import { languageSignalGet } from "#src/app/i18n/languageSignal.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { urlUserProfileMe } from "#src/auth/url/pageRouteAuth.ts"
import { createAction } from "#src/utils/convex_client/createAction.ts"
import { mutationCreate } from "#src/utils/convex_client/mutationCreate.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { profileMeResultNotify } from "./profileMeResultNotify.ts"
import { userProfileMeChangePasswordStateCreate } from "./userProfileMeChangePasswordStateCreate.ts"

export function userProfileMeChangePasswordPageStateCreate() {
  const requestAction = createAction(api.auth.userPasswordChange1RequestAction)
  const confirmMutation = mutationCreate(api.auth.userPasswordChange2ConfirmMutation)
  return userProfileMeChangePasswordStateCreate({
    request: async () => {
      const result = await requestAction({ token: userTokenGet(), l: languageSignalGet() })
      profileMeResultNotify(result, ttc("Verification code sent"), ttc("Password Change Request Failed"))
      return result
    },
    confirm: async (confirmationCode, newPassword) => {
      const result = await confirmMutation({ token: userTokenGet(), confirmationCode, newPassword })
      profileMeResultNotify(result, ttc("Password changed successfully!"), ttc("Password Change Confirmation Failed"))
      if (!result.success) return result
      signInSessionNew(result.data)
      navigateTo(urlUserProfileMe())
      return result
    },
  })
}
