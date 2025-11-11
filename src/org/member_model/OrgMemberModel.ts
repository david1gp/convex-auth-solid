import type { OrgRole } from "@/org/org_model/orgRole"
import type { HasCreatedAtUpdatedAt } from "@/utils/convex/HasCreatedAtUpdatedAt"

export type OrgMemberDataModel = {
  memberId: string
  orgHandle: string
  userId: string
  role: OrgRole
  invitedBy: string
}

export interface OrgMemberModel extends OrgMemberDataModel, HasCreatedAtUpdatedAt {}
