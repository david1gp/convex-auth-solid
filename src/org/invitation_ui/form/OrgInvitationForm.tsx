import { language } from "@/app/i18n/language"
import { languageGetText } from "@/app/i18n/languageGetText"
import { ttc } from "@/app/i18n/ttc"
import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { orgInvitationShowRole } from "@/org/invitation_model/orgInvitationShowRole"
import { orgInvitationFormConfig, orgInvitationFormField } from "@/org/invitation_ui/form/orgInvitationFormField"
import type { OrgInvitationFormStateManagement } from "@/org/invitation_ui/form/orgInvitationFormStateManagement"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { isDevEnv } from "@/utils/env/isDevEnv"
import { mdiEmailFast } from "@mdi/js"
import { Show } from "solid-js"
import { CheckSingle } from "~ui/input/check/CheckSingle"
import { formMode, getFormModeTitle, type FormMode } from "~ui/input/form/formMode"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { LabelPseudo } from "~ui/input/label/LabelPseudo"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveTitle } from "~ui/utils/MayHaveTitle"
import { classMerge } from "~ui/utils/classMerge"

interface HasOrgInvitationFormStateManagement {
  sm: OrgInvitationFormStateManagement
}

export interface OrgInvitationContentProps extends MayHaveTitle, MayHaveClass, HasOrgInvitationFormStateManagement {
  mode: FormMode
}

export function OrgInvitationForm(p: OrgInvitationContentProps) {
  if (isDevEnv()) {
    addKeyboardListenerAlt("t", p.sm.fillTestData)
  }
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <h1 class="text-2xl font-bold mt-6 mb-2">{p.title ?? getOrgInvitationTitle(p.mode)}</h1>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <InvitedNameField sm={p.sm} />
        <InvitedEmailField sm={p.sm} />
        <LanguageField sm={p.sm} />
        {orgInvitationShowRole && <RoleField sm={p.sm} />}
        <ButtonIcon
          type="submit"
          icon={getOrgInvitationIcon(p.mode)}
          variant={p.sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
          isLoading={p.sm.isSubmitting.get()}
          class="w-full"
        >
          {p.sm.isSubmitting.get() ? "Saving..." : getOrgInvitationTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function InvitedNameField(p: HasOrgInvitationFormStateManagement) {
  return (
    <FormFieldInput
      config={orgInvitationFormConfig.invitedName}
      value={p.sm.state.invitedName.get()}
      error={p.sm.errors.invitedName.get()}
      mode={p.sm.mode}
      onInput={(value) => {
        p.sm.state.invitedName.set(value)
        p.sm.validateOnChange(orgInvitationFormField.invitedName)(value)
      }}
      onBlur={(value) => p.sm.validateOnChange(orgInvitationFormField.invitedName)(value)}
    />
  )
}

function InvitedEmailField(p: HasOrgInvitationFormStateManagement) {
  return (
    <FormFieldInput
      config={orgInvitationFormConfig.invitedEmail}
      value={p.sm.state.invitedEmail.get()}
      error={p.sm.errors.invitedEmail.get()}
      mode={p.sm.mode}
      onInput={(value) => {
        p.sm.state.invitedEmail.set(value)
        p.sm.validateOnChange(orgInvitationFormField.invitedEmail)(value)
      }}
      onBlur={(value) => p.sm.validateOnChange(orgInvitationFormField.invitedEmail)(value)}
    />
  )
}

function RoleField(p: HasOrgInvitationFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <FormFieldInput
        config={orgInvitationFormConfig.role}
        value={p.sm.state.role.get()}
        error={p.sm.errors.role.get()}
        mode={p.sm.mode}
        onInput={(value) => {
          p.sm.state.role.set(value)
          p.sm.validateOnChange(orgInvitationFormField.role)(value)
        }}
        onBlur={(value) => p.sm.validateOnChange(orgInvitationFormField.role)(value)}
      />
    </div>
  )
}

function LanguageField(p: HasOrgInvitationFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <LabelPseudo>{orgInvitationFormConfig.l.label()}</LabelPseudo>
      <CheckSingle
        valueSignal={p.sm.state.l}
        getOptions={() => Object.values(language)}
        valueText={(value) => languageGetText(value)}
        disabled={p.sm.mode === formMode.remove}
        innerClass="flex flex-wrap gap-2"
        optionClass="bg-gray-50"
        disallowDeselection={true}
      />
      <Show when={p.sm.errors.l.get()}>
        <p class="text-destructive">{p.sm.errors.l.get()}</p>
      </Show>
    </div>
  )
}

function getOrgInvitationTitle(mode: FormMode): string {
  if (mode === formMode.add) {
    return ttc("Send E-Mail Invitation")
  }
  return getFormModeTitle(mode, ttc("Invitation"))
}

function getOrgInvitationIcon(mode: FormMode): string {
  if (mode === formMode.add) {
    return mdiEmailFast
  }
  return formModeIcon[mode]
}
