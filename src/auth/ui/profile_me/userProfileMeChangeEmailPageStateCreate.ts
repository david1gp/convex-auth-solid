import { api } from "#convex/_generated/api.js"
import { languageSignalGet } from "#src/app/i18n/languageSignal.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { signInSessionNew } from "#src/auth/ui/sign_in/logic/signInSessionNew.ts"
import { userSessionGet, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { urlUserProfileMe } from "#src/auth/url/pageRouteAuth.ts"
import { createAction } from "#src/utils/convex_client/createAction.ts"
import { mutationCreate } from "#src/utils/convex_client/mutationCreate.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { profileMeResultNotify } from "./profileMeResultNotify.ts"
import { userProfileMeChangeEmailStateCreate } from "./userProfileMeChangeEmailStateCreate.ts"

export function userProfileMeChangeEmailPageStateCreate() {
  const requestAction = createAction(api.auth.userEmailChange1RequestAction)
  const confirmMutation = mutationCreate(api.auth.userEmailChange2ConfirmMutation)
  return userProfileMeChangeEmailStateCreate({
    hasPassword: () => userSessionGet().hasPw,
    request: async (newEmail, currentPassword) => {
      const result = await requestAction({
        token: userTokenGet(),
        newEmail,
        currentPassword: userSessionGet().hasPw ? currentPassword : undefined,
        l: languageSignalGet(),
      })
      profileMeResultNotify(result, ttc("Verification code sent"), ttc("Email Change Request Failed"))
      return result
    },
    confirm: async (newEmail, confirmationCode) => {
      const result = await confirmMutation({ token: userTokenGet(), newEmail, confirmationCode })
      profileMeResultNotify(result, ttc("Email changed successfully!"), ttc("Email Change Confirmation Failed"))
      if (!result.success) return result
      signInSessionNew(result.data)
      navigateTo(urlUserProfileMe())
      return result
    },
  })
}
