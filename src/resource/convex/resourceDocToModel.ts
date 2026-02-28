import type { DocResource } from "@/resource/convex/IdResource"
import type { ResourceModel } from "@/resource/model/ResourceModel"

export function resourceDocToModel(m: DocResource): ResourceModel {
  const { _id, _creationTime, ...rest } = m
  return rest
}
