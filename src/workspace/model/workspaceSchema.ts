import { convexSystemFields, fieldsCreatedAtUpdatedAt } from "@/utils/convex/convexSystemFields"
import { handleSchema } from "@/utils/valibot/handleSchema"
import {
  stringSchema1to50,
  stringSchemaDescription,
  stringSchemaName,
  stringSchemaUrl,
} from "@/utils/valibot/stringSchema"
import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import type { WorkspaceModel } from "@/workspace/model/WorkspaceModel"
import * as v from "valibot"

export const workspaceDataSchemaFields = {
  username: v.optional(stringSchema1to50),
  orgHandle: v.optional(handleSchema),
  workspaceHandle: v.pipe(handleSchema),
  // data
  name: v.pipe(stringSchemaName),
  description: v.optional(stringSchemaDescription),
  image: v.optional(stringSchemaUrl),
  url: v.optional(stringSchemaUrl),
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
