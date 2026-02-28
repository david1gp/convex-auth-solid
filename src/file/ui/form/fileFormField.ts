import { ttc } from "@/app/i18n/ttc"
import { fileSchemaFields } from "@/file/model/fileSchema"
import type { FormFieldConfig } from "@/ui/form/formFieldConfigs"
import { formFieldConfigs } from "@/ui/form/formFieldConfigs"

export type FileFormField = keyof typeof fileFormField

export const fileFormField = {
  displayName: "displayName",
  language: "language",
} as const

export const fileFormConfig = {
  displayName: {
    ...formFieldConfigs.name,
    name: "displayName",
    label: () => ttc("Display Name"),
    placeholder: () => ttc("Enter display name for the file"),
    required: true,
    schema: fileSchemaFields.displayName,
  } as const satisfies FormFieldConfig,

  language: {
    name: "language",
    label: () => ttc("Language"),
    placeholder: () => ttc("Select language of the file"),
    schema: fileSchemaFields.language,
  } as const satisfies FormFieldConfig,
} as const satisfies Record<FileFormField, FormFieldConfig>
