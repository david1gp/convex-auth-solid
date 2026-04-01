import type { DocWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"

export function docWorkspaceMemberToModel({ _id, _creationTime, workspaceId, ...rest }: DocWorkspaceMember): WorkspaceMemberModel {
  return { memberId: _id as string, ...rest }
}
