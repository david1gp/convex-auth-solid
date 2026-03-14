import { orgRoleSchema } from "@/org/org_model_field/orgRole"
import { valibotToConvex } from "@/utils/convex/valibotToConvex"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { stringSchemaId } from "@/utils/valibot/stringSchema"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import * as a from "valibot"
import { vIdOrg } from "@/org/org_convex/vIdOrg"
import { vIdUser } from "@/auth/convex/vIdUser"

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
