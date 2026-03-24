import { vIdUser } from "#src/auth/convex/vIdUser.js"
import { vIdOrg } from "#src/org/org_convex/vIdOrg.js"
import { orgRoleSchema } from "#src/org/org_model_field/orgRole.js"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.js"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.js"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.js"
import { defineTable } from "convex/server"

const orgMemberTableDataSchemaFields = {
  orgHandle: stringSchemaId,
  role: orgRoleSchema,
  invitedBy: stringSchemaId,
} as const

export const orgMemberTables = {
  orgMembers: defineTable({
    orgId: vIdOrg,
    userId: vIdUser,
    ...valibotToConvex(orgMemberTableDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    //
    .index("orgId", ["orgId"])
    .index("userId", ["userId"]),
} as const
