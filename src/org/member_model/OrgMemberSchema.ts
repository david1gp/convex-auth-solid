import { orgRoleSchema } from "@/org/org_model/orgRole"
import { fieldsCreatedAtUpdatedAt } from "@/utils/convex/convexSystemFields"
import { stringSchema1to50, stringSchemaId } from "@/utils/valibot/stringSchema"
import * as a from "valibot"

export const orgMemberDataSchemaFields = {
  memberId: stringSchemaId,
  orgHandle: stringSchema1to50,
  userId: stringSchema1to50,
  role: orgRoleSchema,
  invitedBy: stringSchemaId,
} as const

export const orgMemberSchemaFields = {
  ...orgMemberDataSchemaFields,
  ...fieldsCreatedAtUpdatedAt,
} as const

export const orgMemberSchema = a.object(orgMemberSchemaFields)
