import type { OrgRole } from "@/org/org_model/orgRole"
import type { HasConvexSystemFields } from "@/utils/convex/HasConvexSystemFields"
import type { HasCreatedAtUpdatedAt } from "@/utils/convex/HasCreatedAtUpdatedAt"
import type { IdOrgInvitation } from "../invitation_convex/IdOrgInvitation"

export type OrgInvitationDataModel = {
  orgHandle: string
  invitationCode: string
  // invited
  invitedName: string
  invitedEmail: string
  // data
  role: OrgRole
  invitedBy: string
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
