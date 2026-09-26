import * as v from "valibot"

export const e2eOwnedResourceSchema = v.object({
  resourceType: v.pipe(v.string(), v.minLength(1)),
  resourceId: v.pipe(v.string(), v.minLength(1)),
  ownerRunId: v.pipe(v.string(), v.minLength(1)),
  createdAt: v.number(),
})

export const e2eCheckpointSchema = v.object({
  version: v.literal(1),
  environment: v.picklist(["production", "dev"]),
  baseUrl: v.pipe(v.string(), v.url()),
  runId: v.pipe(v.string(), v.minLength(1)),
  createdAt: v.number(),
  completedSuiteIds: v.array(v.string()),
  ownedResources: v.array(e2eOwnedResourceSchema),
})

export type E2eCheckpoint = v.InferOutput<typeof e2eCheckpointSchema>
export type E2eOwnedResource = v.InferOutput<typeof e2eOwnedResourceSchema>
