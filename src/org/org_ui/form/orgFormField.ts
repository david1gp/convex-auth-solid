import { ttc } from "@/app/i18n/ttc"
import { orgDataSchemaFields } from "@/org/org_model/orgSchema"
import type { FormFieldConfig } from "@/ui/form/formFieldConfigs"
import { formFieldConfigs } from "@/ui/form/formFieldConfigs"

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
    label: () => ttc("Stakeholder Handle"),
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
    placeholder: () => ttc("An optional external URL shown on Stakeholder page"),
    schema: orgDataSchemaFields.url,
  } as const satisfies FormFieldConfig,

  image: {
    ...formFieldConfigs.image,
    schema: orgDataSchemaFields.image,
  } as const satisfies FormFieldConfig,
} as const satisfies Record<OrgFormField, FormFieldConfig>
