import { emailSchema } from "@/auth/model/emailSchema"
import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { orgRoleSchema } from "@/org/org_model/orgRole"
import { convexSystemFields, fieldsCreatedAtUpdatedAt } from "@/utils/convex/convexSystemFields"
import { handleSchema } from "@/utils/valibot/handleSchema"
import { stringSchema0to100, stringSchema1to50 } from "@/utils/valibot/stringSchema"
import * as v from "valibot"
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
  emailSendAt: v.optional(dateTimeSchema),
  emailSendAmount: v.number(),
  // acceptance
  acceptedAt: v.optional(dateTimeSchema),
} as const

export const orgInvitationSchema = v.object({
  ...convexSystemFields,
  ...orgInvitationDataSchemaFields,
  ...fieldsCreatedAtUpdatedAt,
})

function types1(o: DocOrgInvitation): OrgInvitationModel {
  return o
}

function types2(o: OrgInvitationModel): DocOrgInvitation {
  return o
}

function types3(o: Omit<OrgInvitationModel, "_id">): Omit<DocOrgInvitation, "_id"> {
  return o
}
