import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import type { DocOrg } from "@/org/org_convex/IdOrg"
import type { OrgMemberProfile } from "../member_model/OrgMemberProfile"

export type OrgViewPageType = {
  org: DocOrg
  members: OrgMemberProfile[]
  invitations: DocOrgInvitation[]
}
