import type { HasConvexSystemFields } from "@/utils/convex/HasConvexSystemFields"
import type { HasCreatedAtUpdatedAt } from "@/utils/convex/HasCreatedAtUpdatedAt"
import type { IdOrg } from "@/org/convex/IdOrg"

export type OrgDataModel = {
  name: string
  slug: string
  description?: string
  url?: string
  image?: string
}

export interface OrgModel extends HasConvexSystemFields<IdOrg>, OrgDataModel, HasCreatedAtUpdatedAt {}