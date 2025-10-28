import type { DocOrg } from "@/org/convex/IdOrg"
import type { OrgModel } from "@/org/model/OrgModel"
import { convexSystemFields, fieldsCreatedAtUpdatedAt } from "@/utils/convex/convexSystemFields"
import {
  string0to2000Schema,
  string0to500Schema,
  string1to50Schema,
  string5to25Schema,
} from "@/utils/valibot/stringSchema"
import * as v from "valibot"

export const orgDataSchemaFields = {
  name: string1to50Schema,
  slug: string5to25Schema,
  description: v.optional(string0to2000Schema),
  url: v.optional(string0to500Schema),
  image: v.optional(string0to500Schema),
} as const

export const orgSchema = v.object({
  ...convexSystemFields,
  ...orgDataSchemaFields,
  ...fieldsCreatedAtUpdatedAt,
})

function types1(o: DocOrg): OrgModel {
  return o
}

function types2(o: OrgModel): DocOrg {
  return o
}

function types3(o: Omit<OrgModel, "_id">): Omit<DocOrg, "_id"> {
  return o
}
