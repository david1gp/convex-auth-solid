import { ttc } from "@/app/i18n/ttc"
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
    label: () => ttc("Current Password"),
    placeholder: () => ttc("Enter current password"),
    type: "password",
    autocomplete: "current-password",
  } as const satisfies FormFieldConfig,

  newPassword: {
    name: "newPassword",
    label: () => ttc("New Password"),
    placeholder: () => ttc("Enter new password (min 12 characters)"),
    type: "password",
    autocomplete: "new-password",
  } as const satisfies FormFieldConfig,

  confirmPassword: {
    name: "confirmPassword",
    label: () => ttc("Confirm New Password"),
    placeholder: () => ttc("Confirm new password"),
    type: "password",
    autocomplete: "new-password",
  } as const satisfies FormFieldConfig,

  newEmail: {
    name: "newEmail",
    label: () => ttc("New Email Address"),
    placeholder: () => ttc("Enter new email address"),
    autocomplete: "email",
  } as const satisfies FormFieldConfig,

  confirmationCode: {
    name: "confirmationCode",
    label: () => ttc("Confirmation Code"),
    placeholder: () => ttc("Enter 6-digit code"),
    maxLength: 6,
  } as const satisfies FormFieldConfig,
} as const satisfies Record<ProfileMeFormField, FormFieldConfig>
