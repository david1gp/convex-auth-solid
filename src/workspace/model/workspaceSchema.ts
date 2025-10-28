import { convexSystemFields, fieldsCreatedAtUpdatedAt } from "@/utils/convex/convexSystemFields"
import {
  string0to2000Schema,
  string0to500Schema,
  string1to50Schema,
  string5to25Schema,
} from "@/utils/valibot/stringSchema"
import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import type { WorkspaceModel } from "@/workspace/model/WorkspaceModel"
import * as v from "valibot"

export const workspaceDataSchemaFields = {
  userId: v.optional(string1to50Schema),
  orgId: v.optional(string1to50Schema),
  name: v.pipe(string1to50Schema),
  slug: v.pipe(string5to25Schema),
  description: v.optional(string0to2000Schema),
  image: v.optional(string0to500Schema),
} as const

export const workspaceDataSchema = v.object(workspaceDataSchemaFields)

export const workspaceSchema = v.object({
  ...convexSystemFields,
  ...workspaceDataSchemaFields,
  ...fieldsCreatedAtUpdatedAt,
})

export function workspaceDocToModel(w: DocWorkspace): WorkspaceModel {
  return w
}
