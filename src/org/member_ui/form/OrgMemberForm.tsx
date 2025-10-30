import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import type { OrgMemberFormStateManagement } from "@/org/member_ui/form/orgMemberEditFormStateManagement"
import { orgMemberFormField } from "@/org/member_ui/form/orgMemberFormField"
import { orgRole } from "@/org/org_model/orgRole"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { getFormTitle, type FormMode } from "~ui/input/form/formMode"
import { getFormIcon } from "~ui/input/form/getFormIcon"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"

interface HasOrgMemberFormStateManagement {
  sm: OrgMemberFormStateManagement
}

export interface OrgMemberContentProps extends MayHaveClass, HasOrgMemberFormStateManagement {
  mode: FormMode
}

export function OrgMemberForm(p: OrgMemberContentProps) {
  if (isDevEnvVite()) {
    addKeyboardListenerAlt("t", p.sm.fillTestData)
  }
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <h1 class="text-2xl font-bold mt-6 mb-2">{getOrgMemberTitle(p.mode)}</h1>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <RoleField sm={p.sm} />
        <ButtonIcon
          type="submit"
          disabled={p.sm.isSaving.get()}
          icon={getFormIcon(p.mode)}
          variant={p.sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
          class="w-full"
        >
          {p.sm.isSaving.get() ? "Saving..." : getOrgMemberTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function RoleField(p: HasOrgMemberFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <label for={orgMemberFormField.role} class="text-sm font-medium">
        {ttt("Role")}
      </label>
      <select
        id={orgMemberFormField.role}
        value={p.sm.state.role.get()}
        onChange={(e) => {
          p.sm.state.role.set(e.currentTarget.value)
          p.sm.validateOnChange(orgMemberFormField.role)(e.currentTarget.value)
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

function getOrgMemberTitle(mode: FormMode): string {
  return getFormTitle(mode, ttt("Organization Member"))
}
