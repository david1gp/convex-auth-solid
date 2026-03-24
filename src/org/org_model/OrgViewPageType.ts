import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.js"
import { orgInvitationSchema } from "#src/org/invitation_model/orgInvitationSchema.js"
import { orgMemberProfileSchema, type OrgMemberProfile } from "#src/org/member_model/OrgMemberProfile.js"
import type { OrgModel } from "#src/org/org_model/OrgModel.js"
import { orgSchema } from "#src/org/org_model/orgSchema.js"
import * as a from "valibot"

export type OrgViewPageType = {
  org: OrgModel
  members: OrgMemberProfile[]
  invitations: OrgInvitationModel[]
}

export const orgViewPageSchema = a.object({
  org: orgSchema,
  members: a.array(orgMemberProfileSchema),
  invitations: a.array(orgInvitationSchema),
})
