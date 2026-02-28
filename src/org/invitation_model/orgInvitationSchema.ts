import { languageSchema } from "@/app/i18n/language"
import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { orgRoleSchema } from "@/org/org_model_field/orgRole"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { handleSchema } from "@/utils/valibot/handleSchema"
import { stringSchema0to100, stringSchemaId } from "@/utils/valibot/stringSchema"
import * as a from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"

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
