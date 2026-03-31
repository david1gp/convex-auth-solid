import { ttc } from "#src/app/i18n/ttc.ts"
import { userRoleIsDevOrAdmin } from "#src/auth/model_field/userRole.ts"
import { addKeyboardListenerAlt } from "#src/auth/ui/sign_up/form/addKeyboardListenerAlt.ts"
import { userSessionGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { OrgFormImage } from "#src/org/org_ui/form/OrgFormImage.tsx"
import { orgFormConfig, orgFormField } from "#src/org/org_ui/form/orgFormField.ts"
import type { OrgFormStateManagement } from "#src/org/org_ui/form/orgFormStateManagement.ts"
import { urlOrgRemove } from "#src/org/org_url/urlOrg.ts"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.tsx"
import { isDevEnv } from "#src/utils/env/isDevEnv.ts"
import { formMode, getFormModeTitle, type FormMode } from "#ui/input/form/formMode.ts"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import { Show } from "solid-js"

interface HasOrgFormStateManagement {
  sm: OrgFormStateManagement
}

export interface OrgContentProps extends MayHaveClass, HasOrgFormStateManagement {
  mode: FormMode
}

export function OrgForm(p: OrgContentProps) {
  if (isDevEnv()) {
    addKeyboardListenerAlt("t", p.sm.fillTestData)
  }
  const isAdminOrDev = () => userRoleIsDevOrAdmin(userSessionGet().profile.role)
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <div class="flex flex-wrap justify-between items-center mt-6 mb-2">
        <h1 class="text-2xl font-bold">{getOrgTitle(p.mode)}</h1>
        <Show when={p.mode === formMode.edit && isAdminOrDev()}>
          <LinkButton
            icon={formModeIcon.remove}
            href={urlOrgRemove(p.sm.state.orgHandle.get())}
            variant={buttonVariant.link}
            class="text-red-600 dark:text-red-400"
          >
            {ttc("Remove")}
          </LinkButton>
        </Show>
      </div>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <NameField sm={p.sm} />
        {p.mode === formMode.add && <HandleField sm={p.sm} />}
        <DescriptionField sm={p.sm} />
        <UrlField sm={p.sm} />
        <ImageField sm={p.sm} />
        <ButtonIcon
          type="submit"
          icon={formModeIcon[p.mode]}
          variant={p.sm.hasErrors() ? buttonVariant.filledRed : buttonVariant.filledIndigo}
          isLoading={p.sm.isSubmitting.get()}
          class="w-full"
        >
          {p.sm.isSubmitting.get() ? "Saving..." : getOrgTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function NameField(p: HasOrgFormStateManagement) {
  return (
    <FormFieldInput
      config={orgFormConfig.name}
      value={p.sm.state.name.get()}
      error={p.sm.errors.name.get()}
      mode={p.sm.mode}
      onInput={(value) => {
        p.sm.state.name.set(value)
        p.sm.validateOnChange(orgFormField.name)(value)
      }}
      onBlur={(value) => p.sm.validateOnChange(orgFormField.name)(value)}
    />
  )
}

function HandleField(p: HasOrgFormStateManagement) {
  return (
    <FormFieldInput
      config={orgFormConfig.orgHandle}
      value={p.sm.state.orgHandle.get()}
      error={p.sm.errors.orgHandle.get()}
      mode={p.sm.mode}
      onInput={(value) => {
        p.sm.state.orgHandle.set(value)
        p.sm.validateOnChange(orgFormField.orgHandle)(value)
      }}
      onBlur={(value) => p.sm.validateOnChange(orgFormField.orgHandle)(value)}
    />
  )
}

function DescriptionField(p: HasOrgFormStateManagement) {
  return (
    <FormFieldInput
      config={orgFormConfig.description}
      value={p.sm.state.description.get()}
      error={p.sm.errors.description.get()}
      mode={p.sm.mode}
      onInput={(value) => {
        p.sm.state.description.set(value)
        p.sm.validateOnChange(orgFormField.description)(value)
      }}
      onBlur={(value) => p.sm.validateOnChange(orgFormField.description)(value)}
    />
  )
}

function UrlField(p: HasOrgFormStateManagement) {
  return (
    <FormFieldInput
      config={orgFormConfig.url}
      value={p.sm.state.url.get()}
      error={p.sm.errors.url.get()}
      mode={p.sm.mode}
      onInput={(value) => {
        p.sm.state.url.set(value)
        p.sm.validateOnChange(orgFormField.url)(value)
      }}
      onBlur={(value) => p.sm.validateOnChange(orgFormField.url)(value)}
    />
  )
}

function ImageField(p: HasOrgFormStateManagement) {
  return <OrgFormImage sm={p.sm} />
}

function getOrgTitle(mode: FormMode): string {
  return getFormModeTitle(mode, ttc("Organization"))
}
