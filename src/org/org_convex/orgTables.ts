import { orgDataSchemaFields } from "@/org/org_model/orgSchema"
import { resourceIdSchema } from "@/resource/model/resourceIdSchema"
import { valibotToConvex } from "@/utils/convex/valibotToConvex"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { stringSchemaId } from "@/utils/valibot/stringSchema"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import * as a from "valibot"
import { vIdOrg } from "@/org/org_convex/vIdOrg"

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
