import type * as a from "valibot"
import type { resourceDataSchema } from "#src/resource/model/resourceSchema.ts"
import type { HasCreatedAtUpdatedAt } from "#src/utils/data/HasCreatedAtUpdatedAt.ts"

export type ResourceDataModel = a.InferOutput<typeof resourceDataSchema>

export interface ResourceModel extends ResourceDataModel, HasCreatedAtUpdatedAt {
  deletedAt?: string
}
