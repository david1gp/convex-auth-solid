import type { DocOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.js"
import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.js"

export function docOrgInvitationToModel({ _id, _creationTime, ...rest }: DocOrgInvitation): OrgInvitationModel {
  return rest
}
