import type { OrgRole } from "@/org/org_model_field/orgRole"
import type { HasCreatedAt } from "@/utils/data/HasCreatedAt"

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
}

export interface OrgInvitationModel extends OrgInvitationDataModel, HasCreatedAt {}
