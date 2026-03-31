import type { DocResource } from "#src/resource/convex/IdResource.ts"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"

export function resourceDocToModel(m: DocResource): ResourceModel {
  const { _id, _creationTime, ...rest } = m
  return rest
}
