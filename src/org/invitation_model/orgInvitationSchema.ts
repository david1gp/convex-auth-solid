import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { orgRoleSchema } from "@/org/org_model/orgRole"
import { fieldsSchemaCreatedAtUpdatedAt } from "@/utils/data/fieldsSchemaCreatedAtUpdatedAt"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { handleSchema } from "@/utils/valibot/handleSchema"
import { stringSchemaId, stringSchemaName } from "@/utils/valibot/stringSchema"
import * as a from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"
import type { DocOrgInvitation } from "../invitation_convex/IdOrgInvitation"

export const orgInvitationDataSchemaFields = {
  // ids
  orgHandle: handleSchema,
  invitationCode: stringSchemaId,
  // invited
  invitedName: stringSchemaName,
  invitedEmail: emailSchema,
  // data
  role: orgRoleSchema,
  invitedBy: stringSchemaName,
  // invitedByName: stringSchema1to50,
  // invitedByEmail: emailSchema,
  // server processing
  emailSendAt: a.optional(dateTimeSchema),
  emailSendAmount: a.number(),
  // acceptance
  acceptedAt: a.optional(dateTimeSchema),
} as const

export const orgInvitationSchema = a.object({
  ...orgInvitationDataSchemaFields,
  ...fieldsSchemaCreatedAtUpdatedAt,
})

function types1(o: DocOrgInvitation): OrgInvitationModel {
  return o
}
