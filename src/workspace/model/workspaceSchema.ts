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
import * as a from "valibot"

export const workspaceDataSchemaFields = {
  username: a.optional(stringSchema1to50),
  orgHandle: a.optional(handleSchema),
  workspaceHandle: a.pipe(handleSchema),
  // data
  name: a.pipe(stringSchemaName),
  description: a.optional(stringSchemaDescription),
  image: a.optional(stringSchemaUrl),
  url: a.optional(stringSchemaUrl),
} as const

export const workspaceDataSchema = a.object(workspaceDataSchemaFields)

export const workspaceSchema = a.object({
  ...convexSystemFields,
  ...workspaceDataSchemaFields,
  ...fieldsCreatedAtUpdatedAt,
})

export function workspaceDocToModel(w: DocWorkspace): WorkspaceModel {
  return w
}
