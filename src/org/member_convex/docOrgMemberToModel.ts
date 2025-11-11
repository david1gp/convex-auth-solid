import type { DocOrgMember } from "@/org/member_convex/IdOrgMember"
import type { OrgMemberModel } from "@/org/member_model/OrgMemberModel"

export function docOrgMemberToModel({ _id, _creationTime, orgId, ...rest }: DocOrgMember): OrgMemberModel {
  return { memberId: _id as string, ...rest }
}
