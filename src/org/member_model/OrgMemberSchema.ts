import { orgRoleSchema } from "@/org/org_model/orgRole"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { stringSchemaId } from "@/utils/valibot/stringSchema"
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
