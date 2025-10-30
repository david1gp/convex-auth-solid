import type { IdUser } from "@/auth/convex/IdUser"
import type { IdOrg } from "@/org/org_convex/IdOrg"
import type { OrgRole } from "@/org/org_model/orgRole"
import type { HasConvexSystemFields } from "@/utils/convex/HasConvexSystemFields"
import type { HasCreatedAtUpdatedAt } from "@/utils/convex/HasCreatedAtUpdatedAt"
import type { IdOrgInvitation } from "../invitation_convex/IdOrgInvitation"

export type OrgInvitationDataModel = {
  orgId: IdOrg
  invitedEmail: string
  // data
  invitationCode: string
  role: OrgRole
  invitedBy: IdUser
  // server processing
  emailSendAt?: string
  emailSendAmount: number
  // acceptance
  acceptedAt?: string
}

export interface OrgInvitationModel
  extends HasConvexSystemFields<IdOrgInvitation>,
    OrgInvitationDataModel,
    HasCreatedAtUpdatedAt {}
