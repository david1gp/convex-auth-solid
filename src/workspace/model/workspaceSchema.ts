import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { convexSchemaSystemFields } from "@/utils/valibot/convexSchemaSystemFields"
import { handleSchema } from "@/utils/valibot/handleSchema"
import {
  stringSchemaDescription,
  stringSchemaId,
  stringSchemaName,
  stringSchemaUrl,
} from "@/utils/valibot/stringSchema"
import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import type { WorkspaceModel } from "@/workspace/model/WorkspaceModel"
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
