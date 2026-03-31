import { languageSchema } from "#src/app/i18n/language.ts"
import { ttc } from "#src/app/i18n/ttc.ts"
import { orgRoleSchema } from "#src/org/org_model_field/orgRole.ts"
import type { FormFieldConfig } from "#src/ui/form/formFieldConfigs.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import { stringSchema } from "#src/utils/valibot/stringSchema.ts"

export type OrgInvitationFormField = keyof typeof orgInvitationFormField

export const orgInvitationFormField = {
  invitedName: "invitedName",
  invitedEmail: "invitedEmail",
  role: "role",
  l: "l",
} as const

export const orgInvitationFormConfig = {
  invitedName: {
    name: "invitedName",
    label: () => ttc("Name"),
    placeholder: () => ttc("Recipient's Full Name"),
    schema: stringSchema,
  } as const satisfies FormFieldConfig,

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
    schema: orgRoleSchema,
  } as const satisfies FormFieldConfig,

  l: {
    name: "l",
    label: () => ttc("Invitation Language"),
    placeholder: () => ttc("Select language"),
    schema: languageSchema,
  } as const satisfies FormFieldConfig,
} as const satisfies Record<OrgInvitationFormField, FormFieldConfig>
