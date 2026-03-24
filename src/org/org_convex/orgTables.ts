import { vIdOrg } from "#src/org/org_convex/vIdOrg.js"
import { orgDataSchemaFields } from "#src/org/org_model/orgSchema.js"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.js"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.js"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.js"
import { dateTimeSchema } from "#utils/valibot/dateTimeSchema.js"
import { defineTable } from "convex/server"

const orgResourceDataSchemaFields = {
  orgHandle: orgDataSchemaFields.orgHandle,
  resourceId: stringSchemaId,
  createdAt: dateTimeSchema,
} as const

const orgMeetingsDataSchemaFields = {
  orgHandle: orgDataSchemaFields.orgHandle,
  meetingId: stringSchemaId,
  createdAt: dateTimeSchema,
} as const

export const orgTables = {
  orgs: defineTable({
    ...valibotToConvex(orgDataSchemaFields),
    ...valibotToConvex(fieldsSchemaCreatedAtUpdatedAt),
  })
    //
    .index("orgHandle", ["orgHandle"]),

  orgResources: defineTable({
    ...valibotToConvex(orgResourceDataSchemaFields),
    orgId: vIdOrg,
  })
    //
    .index("orgHandle", ["orgHandle"]),

  orgMeetings: defineTable({
    ...valibotToConvex(orgMeetingsDataSchemaFields),
    orgId: vIdOrg,
  })
    //
    .index("orgHandle", ["orgHandle"]),
} as const
