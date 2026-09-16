import { defineTable } from "convex/server"
import { v } from "convex/values"
import { languageValidator } from "#src/app/i18n/language.ts"
import { vIdOrg } from "#src/org/org_convex/vIdOrg.ts"
import { orgDataSchemaFields } from "#src/org/org_model/orgSchema.ts"
import { resourceTypeValidator } from "#src/resource/model_field/resourceType.ts"
import { visibilityValidator } from "#src/resource/model_field/visibility.ts"
import { valibotToConvex } from "#src/utils/convex/valibotToConvex.ts"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.ts"
import { stringSchemaId } from "#src/utils/valibot/stringSchema.ts"
import { dateTimeSchema } from "#utils/valibot/dateTimeSchema.js"

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
    searchText: v.optional(v.string()),
    type: v.optional(resourceTypeValidator),
    visibility: v.optional(visibilityValidator),
    language: v.optional(languageValidator),
  })
    //
    .index("orgHandle", ["orgHandle"])
    .index("resourceId", ["resourceId"])
    .searchIndex("search", {
      searchField: "searchText",
      filterFields: ["orgHandle", "type", "visibility", "language"],
    }),

  orgMeetings: defineTable({
    ...valibotToConvex(orgMeetingsDataSchemaFields),
    orgId: vIdOrg,
  })
    //
    .index("orgHandle", ["orgHandle"]),
} as const
