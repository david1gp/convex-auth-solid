import type { DocOrg } from "@/org/org_convex/IdOrg"
import type { OrgModel } from "@/org/org_model/OrgModel"
import { orgHandleSchema } from "@/org/org_model_field/orgHandleSchema"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { stringSchemaDescription, stringSchemaName, stringSchemaUrl } from "@/utils/valibot/stringSchema"
import * as a from "valibot"

export const orgDataSchemaFields = {
  orgHandle: orgHandleSchema,
  // data
  name: a.optional(stringSchemaName),
  description: a.optional(stringSchemaDescription),
  url: a.optional(stringSchemaUrl),
  image: a.optional(stringSchemaUrl),
} as const

export const orgDataSchema = a.object(orgDataSchemaFields)

export const orgDataPartialSchema = a.partial(orgDataSchema)

export const orgSchema = a.object({
  ...orgDataSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAt,
})

function types1(m: DocOrg): OrgModel {
  return m
}
