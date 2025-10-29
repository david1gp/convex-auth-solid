import { convexSystemFields, fieldsCreatedAtUpdatedAt } from "@/utils/convex/convexSystemFields"
import { handleSchema } from "@/utils/valibot/handleSchema"
import { stringSchema0to2000, stringSchema0to500, stringSchema1to50 } from "@/utils/valibot/stringSchema"
import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import type { WorkspaceModel } from "@/workspace/model/WorkspaceModel"
import * as v from "valibot"

export const workspaceDataSchemaFields = {
  userId: v.optional(stringSchema1to50),
  orgId: v.optional(stringSchema1to50),
  workspaceHandle: v.pipe(handleSchema),
  // data
  name: v.pipe(stringSchema1to50),
  description: v.optional(stringSchema0to2000),
  image: v.optional(stringSchema0to500),
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
