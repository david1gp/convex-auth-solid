import { defineTable } from "convex/server"
import * as a from "valibot"
import { languageSchema } from "#src/app/i18n/language.ts"
import { vIdOrg } from "#src/org/org_convex/vIdOrg.ts"
import { orgDataSchemaFields } from "#src/org/org_model/orgSchema.ts"
import { resourceTypeSchema } from "#src/resource/model_field/resourceType.ts"
import { visibilitySchema } from "#src/resource/model_field/visibility.ts"
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
    orgId: vIdOrg,
    ...valibotToConvex({
      ...orgResourceDataSchemaFields,
      searchText: a.optional(a.string()),
      type: a.optional(resourceTypeSchema),
      visibility: a.optional(visibilitySchema),
      language: a.optional(languageSchema),
    }),
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
