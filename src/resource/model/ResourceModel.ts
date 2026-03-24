import type { resourceDataSchema } from "#src/resource/model/resourceSchema.js"
import type { HasCreatedAtUpdatedAt } from "#src/utils/data/HasCreatedAtUpdatedAt.js"
import * as a from "valibot"

export type ResourceDataModel = a.InferOutput<typeof resourceDataSchema>

export interface ResourceModel extends ResourceDataModel, HasCreatedAtUpdatedAt {
  deletedAt?: string
}
