import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { convexSchemaSystemFields } from "#src/utils/valibot/convexSchemaSystemFields.ts"
import { handleSchema } from "#src/utils/valibot/handleSchema.ts"
import { stringSchemaDescription, stringSchemaName, stringSchemaUrl } from "#src/utils/valibot/stringSchema.ts"
import type { DocWorkspace } from "#src/workspace/workspace_convex/IdWorkspace.ts"
import type { WorkspaceModel } from "#src/workspace/workspace_model/WorkspaceModel.ts"
import * as a from "valibot"

export const workspaceDataSchemaFields = {
  workspaceHandle: a.pipe(handleSchema),
  // data
  name: a.pipe(stringSchemaName),
  description: a.optional(stringSchemaDescription),
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
