import { workspaceRoleSchema } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import type { FormFieldConfig } from "#src/ui/form/formFieldConfigs.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import { ttc } from "#src/app/i18n/ttc.ts"

export type WorkspaceInvitationFormField = keyof typeof workspaceInvitationFormField

export const workspaceInvitationFormField = {
  invitedEmail: "invitedEmail",
  role: "role",
} as const

export const workspaceInvitationFormConfig = {
  invitedEmail: {
    name: "invitedEmail",
    label: () => ttc("Email"),
    placeholder: () => ttc("Recipient's Email Address, ex. recipient@gmail.com"),
    autocomplete: "email",
    schema: emailSchema,
  } as const satisfies FormFieldConfig,

  role: {
    name: "role",
    label: () => ttc("Role"),
    placeholder: () => ttc("Select role"),
    schema: workspaceRoleSchema,
  } as const satisfies FormFieldConfig,
} as const satisfies Record<WorkspaceInvitationFormField, FormFieldConfig>
