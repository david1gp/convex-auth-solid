import type { OrgRole } from "#src/org/org_model_field/orgRole.js"
import type { HasCreatedAtUpdatedAt } from "#src/utils/data/HasCreatedAtUpdatedAt.js"

export type OrgMemberDataModel = {
  memberId: string
  orgHandle: string
  userId: string
  role: OrgRole
  invitedBy: string
}

export interface OrgMemberModel extends OrgMemberDataModel, HasCreatedAtUpdatedAt {}
