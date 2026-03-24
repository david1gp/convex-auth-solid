import type { DocResource } from "#src/resource/convex/IdResource.js"
import type { ResourceModel } from "#src/resource/model/ResourceModel.js"

export function resourceDocToModel(m: DocResource): ResourceModel {
  const { _id, _creationTime, ...rest } = m
  return rest
}
