import type { DocOrgMember } from "#src/org/member_convex/IdOrgMember.js"
import type { OrgMemberModel } from "#src/org/member_model/OrgMemberModel.js"

export function docOrgMemberToModel({ _id, _creationTime, orgId, ...rest }: DocOrgMember): OrgMemberModel {
  return { memberId: _id as string, ...rest }
}
