import type { DocOrg } from "@/org/org_convex/IdOrg"
import type { OrgModel } from "@/org/org_model/OrgModel"

export function docOrgToModel({ _id, _creationTime, ...rest }: DocOrg): OrgModel {
  return rest
}
