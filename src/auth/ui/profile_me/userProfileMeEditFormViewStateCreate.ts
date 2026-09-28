import { ttc } from "#src/app/i18n/ttc.ts"
import { apiAuthProfileUpdate } from "#src/auth/api_client/apiAuthProfileUpdate.ts"
import type { UserProfileFieldsTypePublic } from "#src/auth/convex/user/profile_update/userProfileUpdateMutation.ts"
import { userSessionGet, userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"
import { userSessionsSignalAdd } from "#src/auth/ui/signals/userSessionsSignal.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"
import type { UserProfileMeEditFormStateManagement } from "./userProfileMeEditFormState.ts"

export function userProfileMeEditFormViewStateCreate(
  props: () => {
    sm: UserProfileMeEditFormStateManagement
    onSave?: (sm: UserProfileMeEditFormStateManagement) => void
  },
) {
  return {
    handleSubmit: (event: SubmitEvent) => {
      event.preventDefault()
      void (props().onSave ?? userProfileMeEditSave)(props().sm)
    },
  }
}

async function userProfileMeEditSave(sm: UserProfileMeEditFormStateManagement): Promise<void> {
  sm.isLoading.set(true)
  const changedFields = sm.getChangedFields()
  const formData: UserProfileFieldsTypePublic = {
    token: userSessionGet().token,
    name: changedFields.name,
    bio: changedFields.bio,
    url: changedFields.url,
  }
  const result = await apiAuthProfileUpdate(formData)
  if (!result.success) {
    toastAdd({ title: ttc("Update Failed"), description: result.errorMessage, variant: toastVariant.error })
  } else {
    toastAdd({ title: ttc("Profile Updated"), variant: toastVariant.success })
    userSessionsSignalAdd(result.data)
    userSessionSignal.set(result.data)
  }
  sm.isLoading.set(false)
}
