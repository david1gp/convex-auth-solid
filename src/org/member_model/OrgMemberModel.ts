import type { IdUser } from "@/auth/convex/IdUser"
import type { IdOrg, IdOrgMember } from "@/org/convex/IdOrg"
import type { OrgRole } from "@/org/org_model/orgRole"
import type { HasConvexSystemFields } from "@/utils/convex/HasConvexSystemFields"
import type { HasCreatedAtUpdatedAt } from "@/utils/convex/HasCreatedAtUpdatedAt"

export type OrgMemberDataModel = {
  orgId: IdOrg
  userId: IdUser
  role: OrgRole
  invitedBy: IdUser
}

export interface OrgMemberModel extends HasConvexSystemFields<IdOrgMember>, OrgMemberDataModel, HasCreatedAtUpdatedAt {}
