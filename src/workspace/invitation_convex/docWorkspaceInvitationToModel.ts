import type { DocWorkspaceInvitation } from "#src/workspace/invitation_convex/IdWorkspaceInvitation.ts"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"

export function docWorkspaceInvitationToModel({
  _id,
  _creationTime,
  ...rest
}: DocWorkspaceInvitation): WorkspaceInvitationModel {
  return rest
}
