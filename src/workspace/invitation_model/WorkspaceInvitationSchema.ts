import { workspaceRoleSchema } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { emailSchema } from "#src/utils/valibot/emailSchema.ts"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.ts"
import { dateTimeSchema } from "#utils/valibot/dateTimeSchema.js"
import * as a from "valibot"

export const workspaceInvitationStatus = {
  pending: "pending",
  accepted: "accepted",
  dismissed: "dismissed",
} as const

export const workspaceInvitationDataSchemaFields = {
  workspaceHandle: stringSchemaId,
  invitationCode: stringSchemaId,
  invitedEmail: emailSchema,
  role: workspaceRoleSchema,
  invitedBy: stringSchemaId,
  status: a.enum(workspaceInvitationStatus),
  expiresAt: dateTimeSchema,
} as const

export const workspaceInvitationDataSchema = a.object(workspaceInvitationDataSchemaFields)

export const workspaceInvitationSchema = a.object({
  ...workspaceInvitationDataSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAt,
})