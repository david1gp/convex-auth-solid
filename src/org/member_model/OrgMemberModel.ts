import type { OrgRole } from "@/org/org_model_field/orgRole"
import type { HasCreatedAtUpdatedAt } from "@/utils/data/HasCreatedAtUpdatedAt"

export type OrgMemberDataModel = {
  memberId: string
  orgHandle: string
  userId: string
  role: OrgRole
  invitedBy: string
}

export interface OrgMemberModel extends OrgMemberDataModel, HasCreatedAtUpdatedAt {}
