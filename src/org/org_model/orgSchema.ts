import type { DocOrg } from "@/org/org_convex/IdOrg"
import { orgHandleSchema } from "@/org/org_model/orgHandleSchema"
import type { OrgModel } from "@/org/org_model/OrgModel"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { stringSchema0to500, stringSchema0to5000, stringSchemaName } from "@/utils/valibot/stringSchema"
import * as a from "valibot"

export const orgDataSchemaFields = {
  orgHandle: orgHandleSchema,
  // data
  name: stringSchemaName,
  description: a.optional(stringSchema0to5000),
  url: a.optional(stringSchema0to500),
  image: a.optional(stringSchema0to500),
} as const

export const orgSchema = a.object({
  ...orgDataSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAt,
})

function types1(m: DocOrg): OrgModel {
  return m
}
