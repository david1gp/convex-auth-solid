import { ttc } from "#src/app/i18n/ttc.js"
import { fileSchemaFields } from "#src/file/model/fileSchema.js"
import type { FormFieldConfig } from "#src/ui/form/formFieldConfigs.js"
import { formFieldConfigs } from "#src/ui/form/formFieldConfigs.js"

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
