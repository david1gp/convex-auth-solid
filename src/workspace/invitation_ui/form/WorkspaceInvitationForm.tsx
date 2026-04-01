import { ttc } from "#src/app/i18n/ttc.ts"
import { addKeyboardListenerAlt } from "#src/auth/ui/sign_up/form/addKeyboardListenerAlt.ts"
import { workspaceInvitationShowRole } from "#src/workspace/invitation_model/workspaceInvitationShowRole.ts"
import { workspaceInvitationFormConfig, workspaceInvitationFormField } from "#src/workspace/invitation_ui/form/workspaceInvitationFormField.ts"
import type { WorkspaceInvitationFormStateManagement } from "#src/workspace/invitation_ui/form/workspaceInvitationFormStateManagement.ts"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.tsx"
import { isDevEnv } from "#src/utils/env/isDevEnv.ts"
import { formMode, getFormModeTitle, type FormMode } from "#ui/input/form/formMode.ts"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveTitle } from "#ui/utils/MayHaveTitle.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import { mdiEmailFast } from "@mdi/js"

interface HasWorkspaceInvitationFormStateManagement {
  sm: WorkspaceInvitationFormStateManagement
}

export interface WorkspaceInvitationContentProps extends MayHaveTitle, MayHaveClass, HasWorkspaceInvitationFormStateManagement {
  mode: FormMode
}

export function WorkspaceInvitationForm(p: WorkspaceInvitationContentProps) {
  if (isDevEnv()) {
    addKeyboardListenerAlt("t", p.sm.fillTestData)
  }
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <h1 class="text-2xl font-bold mt-6 mb-2">{p.title ?? getWorkspaceInvitationTitle(p.mode)}</h1>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <InvitedEmailField sm={p.sm} />
        {workspaceInvitationShowRole && <RoleField sm={p.sm} />}
        <ButtonIcon
          type="submit"
          icon={getWorkspaceInvitationIcon(p.mode)}
          variant={p.sm.hasErrors() ? buttonVariant.filledRed : buttonVariant.filledIndigo}
          isLoading={p.sm.isSubmitting.get()}
          class="w-full"
        >
          {p.sm.isSubmitting.get() ? "Saving..." : getWorkspaceInvitationTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function InvitedEmailField(p: HasWorkspaceInvitationFormStateManagement) {
  return (
    <FormFieldInput
      config={workspaceInvitationFormConfig.invitedEmail}
      value={p.sm.state.invitedEmail.get()}
      error={p.sm.errors.invitedEmail.get()}
      mode={p.sm.mode}
      onInput={(value) => {
        p.sm.state.invitedEmail.set(value)
        p.sm.validateOnChange(workspaceInvitationFormField.invitedEmail)(value)
      }}
      onBlur={(value) => p.sm.validateOnChange(workspaceInvitationFormField.invitedEmail)(value)}
    />
  )
}

function RoleField(p: HasWorkspaceInvitationFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <FormFieldInput
        config={workspaceInvitationFormConfig.role}
        value={p.sm.state.role.get()}
        error={p.sm.errors.role.get()}
        mode={p.sm.mode}
        onInput={(value) => {
          p.sm.state.role.set(value)
          p.sm.validateOnChange(workspaceInvitationFormField.role)(value)
        }}
        onBlur={(value) => p.sm.validateOnChange(workspaceInvitationFormField.role)(value)}
      />
    </div>
  )
}

function getWorkspaceInvitationTitle(mode: FormMode): string {
  if (mode === formMode.add) {
    return ttc("Send E-Mail Invitation")
  }
  return getFormModeTitle(mode, ttc("Invitation"))
}

function getWorkspaceInvitationIcon(mode: FormMode): string {
  if (mode === formMode.add) {
    return mdiEmailFast
  }
  return formModeIcon[mode]
}
