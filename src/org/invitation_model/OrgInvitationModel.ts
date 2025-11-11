import type { OrgRole } from "@/org/org_model/orgRole"
import type { HasCreatedAtUpdatedAt } from "@/utils/convex/HasCreatedAtUpdatedAt"

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

export interface OrgInvitationModel extends OrgInvitationDataModel, HasCreatedAtUpdatedAt {}
