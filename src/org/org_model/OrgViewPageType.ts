import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { orgInvitationSchema } from "@/org/invitation_model/orgInvitationSchema"
import type { OrgModel } from "@/org/org_model/OrgModel"
import { orgSchema } from "@/org/org_model/orgSchema"
import * as a from "valibot"
import { orgMemberProfileSchema, type OrgMemberProfile } from "../member_model/OrgMemberProfile"

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
