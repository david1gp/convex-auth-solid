import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { orgRoleSchema } from "@/org/org_model/orgRole"
import { fieldsCreatedAtUpdatedAt } from "@/utils/convex/convexSystemFields"
import { emailSchema } from "@/utils/valibot/emailSchema"
import { handleSchema } from "@/utils/valibot/handleSchema"
import { stringSchema0to100, stringSchema1to50 } from "@/utils/valibot/stringSchema"
import * as a from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"
import type { DocOrgInvitation } from "../invitation_convex/IdOrgInvitation"

export const orgInvitationDataSchemaFields = {
  // ids
  orgHandle: handleSchema,
  invitationCode: stringSchema1to50,
  // invited
  invitedName: stringSchema0to100,
  invitedEmail: emailSchema,
  // data
  role: orgRoleSchema,
  invitedBy: stringSchema1to50,
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
  ...fieldsCreatedAtUpdatedAt,
})

function types1(o: DocOrgInvitation): OrgInvitationModel {
  return o
}
