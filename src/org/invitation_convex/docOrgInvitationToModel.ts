import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"

export function docOrgInvitationToModel({ _id, _creationTime, ...rest }: DocOrgInvitation): OrgInvitationModel {
  return rest
}
