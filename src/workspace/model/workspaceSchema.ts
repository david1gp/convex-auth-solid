import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.js"
import { convexSchemaSystemFields } from "#src/utils/valibot/convexSchemaSystemFields.js"
import { handleSchema } from "#src/utils/valibot/handleSchema.js"
import {
    stringSchemaDescription,
    stringSchemaId,
    stringSchemaName,
    stringSchemaUrl,
} from "#src/utils/valibot/stringSchema.js"
import type { DocWorkspace } from "#src/workspace/convex/IdWorkspace.js"
import type { WorkspaceModel } from "#src/workspace/model/WorkspaceModel.js"
import * as a from "valibot"

export const workspaceDataSchemaFields = {
  username: a.optional(stringSchemaId),
  orgHandle: a.optional(handleSchema),
  workspaceHandle: a.pipe(handleSchema),
  // data
  name: a.pipe(stringSchemaName),
  subtitle: a.optional(stringSchemaDescription),
  image: a.optional(stringSchemaUrl),
  url: a.optional(stringSchemaUrl),
} as const

export const workspaceDataSchema = a.object(workspaceDataSchemaFields)

export const workspaceSchema = a.object({
  ...convexSchemaSystemFields,
  ...workspaceDataSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAt,
})

export function workspaceDocToModel(w: DocWorkspace): WorkspaceModel {
  return w
}
