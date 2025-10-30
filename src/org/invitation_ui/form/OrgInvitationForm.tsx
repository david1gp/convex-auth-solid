import type { OrgInvitationFormStateManagement } from "@/org/invitation_ui/form/orgInvitationFormStateManagement"
import { orgInvitationFormField } from "@/org/invitation_ui/form/orgInvitationFormField"
import { orgRole } from "@/org/org_model/orgRole"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { getFormTitle, type FormMode } from "~ui/input/form/formMode"
import { getFormIcon } from "~ui/input/form/getFormIcon"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"

interface HasOrgInvitationFormStateManagement {
  sm: OrgInvitationFormStateManagement
}

export interface OrgInvitationContentProps extends MayHaveClass, HasOrgInvitationFormStateManagement {
  mode: FormMode
}

export function OrgInvitationForm(p: OrgInvitationContentProps) {
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <h1 class="text-2xl font-bold mt-6 mb-2">{getOrgInvitationTitle(p.mode)}</h1>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <InvitedEmailField sm={p.sm} />
        <RoleField sm={p.sm} />
        <ButtonIcon
          type="submit"
          disabled={p.sm.isSaving.get()}
          icon={getFormIcon(p.mode)}
          variant={p.sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
          class="w-full"
        >
          {p.sm.isSaving.get() ? "Saving..." : getOrgInvitationTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function InvitedEmailField(p: HasOrgInvitationFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <label for={orgInvitationFormField.invitedEmail} class="text-sm font-medium">
        {ttt("Email")}
      </label>
      <input
        id={orgInvitationFormField.invitedEmail}
        type="email"
        value={p.sm.state.invitedEmail.get()}
        onInput={(e) => {
          p.sm.state.invitedEmail.set(e.currentTarget.value)
          p.sm.validateOnChange(orgInvitationFormField.invitedEmail)(e.currentTarget.value)
        }}
        class={classMerge(
          "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          p.sm.errors.invitedEmail.get() && "border-destructive focus-visible:ring-destructive",
        )}
        placeholder="user@example.com"
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
        <option value={orgRole.member}>{ttt("Member")}</option>
        <option value={orgRole.guest}>{ttt("Guest")}</option>
      </select>
      <Show when={p.sm.errors.role.get()}>
        <p class="text-destructive">{p.sm.errors.role.get()}</p>
      </Show>
    </div>
  )
}

function getOrgInvitationTitle(mode: FormMode): string {
  return getFormTitle(mode, ttt("Organization Invitation"))
}