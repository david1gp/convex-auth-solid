import type { OrgModel } from "@/org/org_model/OrgModel"
import { recordCreateFromList } from "@/utils/obj/recordCreateFromList"

export function constructOrgRecord(list: OrgModel[]) {
  return recordCreateFromList(list, orgToId, orgToName)
}
function orgToId(o: OrgModel) {
  return o.orgHandle
}
function orgToName(o: OrgModel) {
  return o.name ?? o.orgHandle
}
