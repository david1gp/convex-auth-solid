import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { orgInvitationShowRole } from "@/org/invitation_model/orgInvitationShowRole"
import { orgInvitationFormField } from "@/org/invitation_ui/form/orgInvitationFormField"
import type { OrgInvitationFormStateManagement } from "@/org/invitation_ui/form/orgInvitationFormStateManagement"
import { orgRole } from "@/org/org_model/orgRole"
import { orgRoleText } from "@/org/org_model/orgRoleText"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { getFormModeTitle, type FormMode } from "~ui/input/form/formMode"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { Input } from "~ui/input/input/Input"
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
  if (isDevEnvVite()) {
    addKeyboardListenerAlt("t", p.sm.fillTestData)
  }
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <h1 class="text-2xl font-bold mt-6 mb-2">{p.title ?? getOrgInvitationTitle(p.mode)}</h1>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <InvitedNameField sm={p.sm} />
        <InvitedEmailField sm={p.sm} />
        {orgInvitationShowRole && <RoleField sm={p.sm} />}
        <ButtonIcon
          type="submit"
          disabled={p.sm.isSaving.get()}
          icon={formModeIcon[p.mode]}
          variant={p.sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
          class="w-full"
        >
          {p.sm.isSaving.get() ? "Saving..." : getOrgInvitationTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function InvitedNameField(p: HasOrgInvitationFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <label for={orgInvitationFormField.invitedName} class="font-medium">
        {ttt("Name")}
      </label>
      <Input
        id={orgInvitationFormField.invitedName}
        value={p.sm.state.invitedName.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.invitedName.set(value)
          p.sm.validateOnChange(orgInvitationFormField.invitedName)(value)
        }}
        class={classMerge("", p.sm.errors.invitedName.get() && "border-destructive focus-visible:ring-destructive")}
        placeholder={ttt("Recipient's Full Name")}
      />
      <Show when={p.sm.errors.invitedName.get()}>
        <p class="text-destructive">{p.sm.errors.invitedName.get()}</p>
      </Show>
    </div>
  )
}

function InvitedEmailField(p: HasOrgInvitationFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <label for={orgInvitationFormField.invitedEmail} class="font-medium">
        {ttt("Email")}
      </label>
      <Input
        id={orgInvitationFormField.invitedEmail}
        value={p.sm.state.invitedEmail.get()}
        type="email"
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.invitedEmail.set(value)
          p.sm.validateOnChange(orgInvitationFormField.invitedEmail)(value)
        }}
        class={classMerge(
          "focus-visible:ring-2",
          p.sm.errors.invitedEmail.get() && "border-destructive focus-visible:ring-destructive",
        )}
        placeholder={ttt("Recipient's Email Address, ex. recipient@gmail.com")}
      />
      <Show when={p.sm.errors.invitedEmail.get()}>
        <p class="text-destructive">{p.sm.errors.invitedEmail.get()}</p>
      </Show>
    </div>
  )
}

function RoleField(p: HasOrgInvitationFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <label for={orgInvitationFormField.role} class="text-sm font-medium">
        {ttt("Role")}
      </label>
      <select
        id={orgInvitationFormField.role}
        value={p.sm.state.role.get()}
        onChange={(e) => {
          p.sm.state.role.set(e.currentTarget.value)
          p.sm.validateOnChange(orgInvitationFormField.role)(e.currentTarget.value)
        }}
        class={classMerge(
          "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          p.sm.errors.role.get() && "border-destructive focus-visible:ring-destructive",
        )}
      >
        <option value={orgRole.member}>{orgRoleText.member}</option>
        <option value={orgRole.guest}>{orgRoleText.guest}</option>
      </select>
      <Show when={p.sm.errors.role.get()}>
        <p class="text-destructive">{p.sm.errors.role.get()}</p>
      </Show>
    </div>
  )
}

function getOrgInvitationTitle(mode: FormMode): string {
  return getFormModeTitle(mode, ttt("Organization Invitation"))
}
