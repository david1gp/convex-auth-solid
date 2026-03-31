import type { DocOrg } from "#src/org/org_convex/IdOrg.ts"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"

export function docOrgToModel({ _id, _creationTime, ...rest }: DocOrg): OrgModel {
  return rest
}
