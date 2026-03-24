import type { OrgModel } from "#src/org/org_model/OrgModel.js"
import { recordCreateFromList } from "#src/utils/obj/recordCreateFromList.js"

export function constructOrgRecord(list: OrgModel[]) {
  return recordCreateFromList(list, orgToId, orgToName)
}
function orgToId(o: OrgModel) {
  return o.orgHandle
}
function orgToName(o: OrgModel) {
  return o.name ?? o.orgHandle
}
