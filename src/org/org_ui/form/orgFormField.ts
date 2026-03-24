import { ttc } from "#src/app/i18n/ttc.js"
import { orgDataSchemaFields } from "#src/org/org_model/orgSchema.js"
import type { FormFieldConfig } from "#src/ui/form/formFieldConfigs.js"
import { formFieldConfigs } from "#src/ui/form/formFieldConfigs.js"

export type OrgFormField = keyof typeof orgFormField

export const orgFormField = {
  // id
  orgHandle: "orgHandle",
  // data
  name: "name",
  description: "description",
  url: "url",
  image: "image",
} as const

export const orgFormConfig = {
  orgHandle: {
    name: "orgHandle",
    label: () => ttc("Organization Handle"),
    placeholder: () => ttc("A unique identifier, visible in the url, ex. your-company-name"),
    required: true,
    autocomplete: "organization-name",
    schema: orgDataSchemaFields.orgHandle,
  } as const satisfies FormFieldConfig,

  name: {
    ...formFieldConfigs.name,
    placeholder: () => ttc("Enter organization name, ex. ACME"),
    required: true,
    schema: orgDataSchemaFields.name,
  } as const satisfies FormFieldConfig,

  description: {
    ...formFieldConfigs.description,
    maxLength: formFieldConfigs.description.maxLength,
    placeholder: () => ttc("A brief description of your organization"),
    schema: orgDataSchemaFields.description,
  } as const satisfies FormFieldConfig,

  url: {
    ...formFieldConfigs.url,
    placeholder: () => ttc("An optional external URL shown on Organization page"),
    schema: orgDataSchemaFields.url,
  } as const satisfies FormFieldConfig,

  image: {
    ...formFieldConfigs.image,
    schema: orgDataSchemaFields.image,
  } as const satisfies FormFieldConfig,
} as const satisfies Record<OrgFormField, FormFieldConfig>
