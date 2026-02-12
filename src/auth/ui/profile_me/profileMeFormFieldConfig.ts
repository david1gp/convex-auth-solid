import { ttt } from "~ui/i18n/ttt"
import type { FormFieldConfig } from "@/ui/form/formFieldConfigs"

export const profileMeFormField = {
  currentPassword: "currentPassword",
  newPassword: "newPassword",
  confirmPassword: "confirmPassword",
  newEmail: "newEmail",
  confirmationCode: "confirmationCode",
} as const

export type ProfileMeFormField = (typeof profileMeFormField)[keyof typeof profileMeFormField]

export const profileMeFormFieldConfig = {
  currentPassword: {
    name: "currentPassword",
    label: ttt("Current Password"),
    placeholder: ttt("Enter current password"),
    type: "password",
    autocomplete: "current-password",
  } as const satisfies FormFieldConfig,

  newPassword: {
    name: "newPassword",
    label: ttt("New Password"),
    placeholder: ttt("Enter new password (min 12 characters)"),
    type: "password",
    autocomplete: "new-password",
  } as const satisfies FormFieldConfig,

  confirmPassword: {
    name: "confirmPassword",
    label: ttt("Confirm New Password"),
    placeholder: ttt("Confirm new password"),
    type: "password",
    autocomplete: "new-password",
  } as const satisfies FormFieldConfig,

  newEmail: {
    name: "newEmail",
    label: ttt("New Email Address"),
    placeholder: ttt("Enter new email address"),
    autocomplete: "email",
  } as const satisfies FormFieldConfig,

  confirmationCode: {
    name: "confirmationCode",
    label: ttt("Confirmation Code"),
    placeholder: ttt("Enter 6-digit code"),
    maxLength: 6,
  } as const satisfies FormFieldConfig,
} as const satisfies Record<ProfileMeFormField, FormFieldConfig>
