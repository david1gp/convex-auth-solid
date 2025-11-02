import type { IdOrg } from "@/org/org_convex/IdOrg"
import type { HasConvexSystemFields } from "@/utils/convex/HasConvexSystemFields"
import type { HasCreatedAtUpdatedAt } from "@/utils/convex/HasCreatedAtUpdatedAt"

export type OrgDataModel = {
  name: string
  orgHandle: string
  description?: string
  url?: string
  image?: string
}

export interface OrgModel extends HasConvexSystemFields<IdOrg>, OrgDataModel, HasCreatedAtUpdatedAt {}

export function orgDataModelCreateEmpty(): OrgDataModel {
  return { name: "", orgHandle: "test-org-empty", description: "", url: "", image: "" }
}
