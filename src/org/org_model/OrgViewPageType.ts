import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.ts"
import { orgInvitationSchema } from "#src/org/invitation_model/orgInvitationSchema.ts"
import { orgMemberProfileSchema, type OrgMemberProfile } from "#src/org/member_model/OrgMemberProfile.ts"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import { orgSchema } from "#src/org/org_model/orgSchema.ts"
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
