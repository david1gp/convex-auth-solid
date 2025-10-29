import type { IdUser } from "@/auth/convex/IdUser"
import type { IdOrg } from "@/org/org_convex/IdOrg"
import type { OrgRole } from "@/org/org_model/orgRole"
import type { HasConvexSystemFields } from "@/utils/convex/HasConvexSystemFields"
import type { HasCreatedAtUpdatedAt } from "@/utils/convex/HasCreatedAtUpdatedAt"
import type { IdOrgMember } from "../member_convex/IdOrgMember"

export type OrgMemberDataModel = {
  orgId: IdOrg
  userId: IdUser
  role: OrgRole
  invitedBy: IdUser
}

export interface OrgMemberModel extends HasConvexSystemFields<IdOrgMember>, OrgMemberDataModel, HasCreatedAtUpdatedAt {}
