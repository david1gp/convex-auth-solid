import { workspaceRoleSchema } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.ts"
import * as a from "valibot"

export const workspaceMemberDataSchemaFields = {
  memberId: stringSchemaId,
  workspaceHandle: stringSchemaId,
  userId: stringSchemaId,
  role: workspaceRoleSchema,
  invitedBy: stringSchemaId,
} as const

export const workspaceMemberSchemaFields = {
  ...workspaceMemberDataSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAt,
} as const

export const workspaceMemberSchema = a.object(workspaceMemberSchemaFields)