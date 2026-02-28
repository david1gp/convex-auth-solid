import { ttc } from "@/app/i18n/ttc"
import { apiAuthProfileUpdate } from "@/auth/api/apiAuthProfileUpdate"
import type { UserProfileFieldsTypePublic } from "@/auth/convex/user/profile_update/userProfileUpdateMutation"
import { userProfileFormConfig } from "@/auth/ui/profile/userProfileFormField"
import { userSessionGet, userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"
import { urlUserProfileMe } from "@/auth/url/pageRouteAuth"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { formMode } from "~ui/input/form/formMode"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { UserProfileMeEditFormStateManagement } from "./userProfileMeEditFormState"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"

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
          <Button type="submit" variant={buttonVariant.primary} disabled={p.sm.isLoading.get()}>
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
