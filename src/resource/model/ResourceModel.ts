import type { resourceDataSchema } from "@/resource/model/resourceSchema"
import type { HasCreatedAtUpdatedAt } from "@/utils/data/HasCreatedAtUpdatedAt"
import * as a from "valibot"

export type ResourceDataModel = a.InferOutput<typeof resourceDataSchema>

export interface ResourceModel extends ResourceDataModel, HasCreatedAtUpdatedAt {
  deletedAt?: string
}
