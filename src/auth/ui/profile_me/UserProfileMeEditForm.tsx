import { ttc } from "#src/app/i18n/ttc.js"
import { apiAuthProfileUpdate } from "#src/auth/api/apiAuthProfileUpdate.js"
import type { UserProfileFieldsTypePublic } from "#src/auth/convex/user/profile_update/userProfileUpdateMutation.js"
import { userProfileFormConfig } from "#src/auth/ui/profile/userProfileFormField.js"
import { userSessionGet, userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.js"
import { userSessionsSignalAdd } from "#src/auth/ui/signals/userSessionsSignal.js"
import { urlUserProfileMe } from "#src/auth/url/pageRouteAuth.js"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.jsx"
import { formMode } from "#ui/input/form/formMode.js"
import { Button } from "#ui/interactive/button/Button.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { toastAdd } from "#ui/interactive/toast/toastAdd.js"
import { toastVariant } from "#ui/interactive/toast/toastVariant.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { classMerge } from "#ui/utils/classMerge.js"
import type { UserProfileMeEditFormStateManagement } from "./userProfileMeEditFormState.js"

export interface UserProfileMeEditFormProps extends MayHaveClass {
  sm: UserProfileMeEditFormStateManagement
}

export function UserProfileMeEditForm(p: UserProfileMeEditFormProps) {
  return (
    <div class={classMerge("bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", p.class)}>
      <form
        class="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          handleSave(p.sm)
        }}
      >
        <NameField sm={p.sm} />
        <BioField sm={p.sm} />
        <UrlField sm={p.sm} />

        <div class="mt-6 flex justify-end space-x-4">
          <LinkButton href={urlUserProfileMe()} variant={buttonVariant.link}>
            {ttc("Cancel")}
          </LinkButton>
          <Button type="submit" variant={buttonVariant.filledIndigo} disabled={p.sm.isLoading.get()}>
            {p.sm.isLoading.get() ? ttc("Saving...") : ttc("Save Changes")}
          </Button>
        </div>
      </form>
    </div>
  )
}

interface HasUserProfileMeEditFormStateManagement {
  sm: UserProfileMeEditFormStateManagement
}

function NameField(p: HasUserProfileMeEditFormStateManagement) {
  return (
    <div>
      <FormFieldInput
        config={userProfileFormConfig.name}
        value={p.sm.state.name.get()}
        error={p.sm.errors.name.get()}
        mode={formMode.edit}
        onInput={(value: string) => {
          p.sm.state.name.set(value)
        }}
        onBlur={(value: string) => {
          p.sm.state.name.set(value)
        }}
      />
    </div>
  )
}

function BioField(p: HasUserProfileMeEditFormStateManagement) {
  return (
    <div>
      <FormFieldInput
        config={userProfileFormConfig.bio}
        value={p.sm.state.bio.get()}
        error={p.sm.errors.bio.get()}
        mode={formMode.edit}
        onInput={(value: string) => {
          p.sm.state.bio.set(value)
        }}
        onBlur={(value: string) => {
          p.sm.state.bio.set(value)
        }}
      />
    </div>
  )
}

function UrlField(p: HasUserProfileMeEditFormStateManagement) {
  return (
    <div>
      <FormFieldInput
        config={userProfileFormConfig.url}
        value={p.sm.state.url.get()}
        error={p.sm.errors.url.get()}
        mode={formMode.edit}
        onInput={(value: string) => {
          p.sm.state.url.set(value)
        }}
        onBlur={(value: string) => {
          p.sm.state.url.set(value)
        }}
      />
    </div>
  )
}

async function handleSave(sm: UserProfileMeEditFormStateManagement): Promise<void> {
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
    toastAdd({
      title: ttc("Update Failed"),
      description: result.errorMessage,
      variant: toastVariant.error,
    })
  } else if (result.success) {
    toastAdd({
      title: ttc("Profile Updated"),
      variant: toastVariant.success,
    })
    const newSession = result.data
    userSessionsSignalAdd(newSession)
    userSessionSignal.set(newSession)
  }
  sm.isLoading.set(false)
}
