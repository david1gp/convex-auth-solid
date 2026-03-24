import type { DocOrg } from "#src/org/org_convex/IdOrg.js"
import type { OrgModel } from "#src/org/org_model/OrgModel.js"

export function docOrgToModel({ _id, _creationTime, ...rest }: DocOrg): OrgModel {
  return rest
}
