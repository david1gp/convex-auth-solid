import { languageSchema } from "#src/app/i18n/language.js"
import type { DocOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.js"
import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.js"
import { orgRoleSchema } from "#src/org/org_model_field/orgRole.js"
import { fieldsSchemaCreatedAtUpdatedAt } from "#src/utils/data/fieldsSchemaCreatedAtUpdatedAt.js"
import { emailSchema } from "#src/utils/valibot/emailSchema.js"
import { handleSchema } from "#src/utils/valibot/handleSchema.js"
import { stringSchema0to100, stringSchemaId } from "#src/utils/valibot/stringSchema.js"
import { dateTimeSchema } from "#utils/valibot/dateTimeSchema"
import * as a from "valibot"

export const orgInvitationDataSchemaFields = {
  // ids
  orgHandle: handleSchema,
  invitationCode: stringSchemaId,
  // invited
  invitedName: stringSchema0to100,
  invitedEmail: emailSchema,
  l: languageSchema,
  // data
  role: orgRoleSchema,
  invitedBy: stringSchemaId,
  // invitedByName: stringSchema1to50,
  // invitedByEmail: emailSchema,
  // server processing
  emailSendAt: a.optional(dateTimeSchema),
  emailSendAmount: a.number(),
} as const

export const orgInvitationDataSchema = a.object(orgInvitationDataSchemaFields)

export const orgInvitationSchema = a.object({
  ...orgInvitationDataSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAt,
})

function types1(o: DocOrgInvitation): OrgInvitationModel {
  return o
}
