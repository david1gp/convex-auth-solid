import { orgRoleSchema } from "#src/org/org_model_field/orgRole.js"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.js"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.js"
import * as a from "valibot"

export const orgMemberDataSchemaFields = {
  memberId: stringSchemaId,
  orgHandle: stringSchemaId,
  userId: stringSchemaId,
  role: orgRoleSchema,
  invitedBy: stringSchemaId,
} as const

export const orgMemberSchemaFields = {
  ...orgMemberDataSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAt,
} as const

export const orgMemberSchema = a.object(orgMemberSchemaFields)
