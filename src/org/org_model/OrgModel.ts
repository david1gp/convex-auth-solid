import type { HasCreatedAtUpdatedAt } from "@/utils/data/HasCreatedAtUpdatedAt"

export type OrgDataModel = {
  // id
  orgHandle: string
  // data
  name: string
  description?: string
  url?: string
  image?: string
}

export interface OrgModel extends OrgDataModel, HasCreatedAtUpdatedAt {}

export function orgDataModelCreateEmpty(): OrgDataModel {
  return { name: "", orgHandle: "test-org-empty", description: "", url: "", image: "" }
}
