import { ttc } from "#src/app/i18n/ttc.ts"
import { addKeyboardListenerAlt } from "#src/auth/ui/sign_up/form/addKeyboardListenerAlt.ts"
import { workspaceMemberFormField } from "#src/workspace/member_ui/form/workspaceMemberFormField.ts"
import type { WorkspaceMemberFormStateManagement } from "#src/workspace/member_ui/form/workspaceMemberFormStateManagement.ts"
import { workspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { isDevEnv } from "#src/utils/env/isDevEnv.ts"
import { getFormModeTitle, type FormMode } from "#ui/input/form/formMode.ts"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import { Show } from "solid-js"

interface HasWorkspaceMemberFormStateManagement {
  sm: WorkspaceMemberFormStateManagement
}

export interface WorkspaceMemberContentProps extends MayHaveClass, HasWorkspaceMemberFormStateManagement {
  mode: FormMode
}

export function WorkspaceMemberForm(p: WorkspaceMemberContentProps) {
  if (isDevEnv()) {
    addKeyboardListenerAlt("t", p.sm.fillTestData)
  }
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <h1 class="text-2xl font-bold mt-6 mb-2">{getWorkspaceMemberTitle(p.mode)}</h1>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <RoleField sm={p.sm} />
        <ButtonIcon
          type="submit"
          icon={formModeIcon[p.mode]}
          variant={p.sm.hasErrors() ? buttonVariant.filledRed : buttonVariant.filledIndigo}
          isLoading={p.sm.isSubmitting.get()}
          class="w-full"
        >
          {p.sm.isSubmitting.get() ? "Saving..." : getWorkspaceMemberTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function RoleField(p: HasWorkspaceMemberFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <label for={workspaceMemberFormField.role} class="text-sm font-medium">
        {ttc("Role")}
      </label>
      <select
        id={workspaceMemberFormField.role}
        value={p.sm.state.role.get()}
        onChange={(e) => {
          p.sm.state.role.set(e.currentTarget.value)
          p.sm.validateOnChange(workspaceMemberFormField.role)(e.currentTarget.value)
        }}
        class={classMerge(
          "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          p.sm.errors.role.get() && "border-destructive focus-visible:ring-destructive",
        )}
      >
        <option value={workspaceRole.member}>{ttc("Member")}</option>
        <option value={workspaceRole.guest}>{ttc("Guest")}</option>
      </select>
      <Show when={p.sm.errors.role.get()}>
        <p class="text-destructive">{p.sm.errors.role.get()}</p>
      </Show>
    </div>
  )
}

function getWorkspaceMemberTitle(mode: FormMode): string {
  return getFormModeTitle(mode, ttc("Workspace Member"))
}
