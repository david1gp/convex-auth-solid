import type { OrgRole } from "@/org/org_model_field/orgRole"
import type { HasCreatedAtUpdatedAt } from "@/utils/data/HasCreatedAtUpdatedAt"

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
