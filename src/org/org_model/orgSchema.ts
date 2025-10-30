import type { DocOrg } from "@/org/org_convex/IdOrg"
import type { OrgModel } from "@/org/org_model/OrgModel"
import { convexSystemFields, fieldsCreatedAtUpdatedAt } from "@/utils/convex/convexSystemFields"
import { handleSchema } from "@/utils/valibot/handleSchema"
import { stringSchema0to500, stringSchema0to5000, stringSchema1to50 } from "@/utils/valibot/stringSchema"
import * as v from "valibot"

export const orgDataSchemaFields = {
  orgHandle: handleSchema,
  // data
  name: stringSchema1to50,
  description: v.optional(stringSchema0to5000),
  url: v.optional(stringSchema0to500),
  image: v.optional(stringSchema0to500),
} as const

export const orgSchema = v.object({
  ...convexSystemFields,
  ...orgDataSchemaFields,
  ...fieldsCreatedAtUpdatedAt,
})

function types1(m: DocOrg): OrgModel {
  return m
}

function types2(m: OrgModel): DocOrg {
  return m
}

function types3(m: Omit<OrgModel, "_id">): Omit<DocOrg, "_id"> {
  return m
}
