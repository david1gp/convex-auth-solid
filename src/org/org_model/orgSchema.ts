import type { DocOrg } from "#src/org/org_convex/IdOrg.js"
import type { OrgModel } from "#src/org/org_model/OrgModel.js"
import { orgHandleSchema } from "#src/org/org_model_field/orgHandleSchema.js"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.js"
import { stringSchemaDescription, stringSchemaName, stringSchemaUrl } from "#src/utils/valibot/stringSchema.js"
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
