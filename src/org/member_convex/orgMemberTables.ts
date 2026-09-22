import { defineTable } from "convex/server"
import { vIdUser } from "#src/auth/convex/vIdUser.ts"
import { orgMemberDataSchemaFields } from "#src/org/member_model/OrgMemberSchema.ts"
import { vIdOrg } from "#src/org/org_convex/vIdOrg.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"

const orgMemberTableDataSchemaFields = {
  orgHandle: orgMemberDataSchemaFields.orgHandle,
  role: orgMemberDataSchemaFields.role,
  invitedBy: orgMemberDataSchemaFields.invitedBy,
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
