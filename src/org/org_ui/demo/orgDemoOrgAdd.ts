import { createResult, createResultError } from "#result"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import type { OrgFormData } from "#src/org/org_ui/form/orgFormStateManagement.ts"

/** Pure fixture update. The caller stores the result only in the page demo's memory store. */
export function orgDemoOrgAdd(orgs: OrgModel[], data: OrgFormData) {
  const op = "orgDemoOrgAdd"
  if (orgs.some((org) => org.orgHandle === data.orgHandle)) {
    return createResultError(op, "This organization handle is already in the demo list")
  }
  const date = "2026-09-28T09:00:00.000Z"
  return createResult([{ ...data, createdAt: date, updatedAt: date }, ...orgs])
}
