import { expect, test } from "bun:test"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import { resourceFilter, resourceFilterCreate } from "./resourceFilterFields.ts"

const resource: ResourceModel = {
  resourceId: "e2e-disposable-resource-20260918-a",
  name: "E2E Disposable Resource 20260918 A EDITED",
  createdAt: "2026-09-18T00:00:00.000Z",
  updatedAt: "2026-09-18T00:00:00.000Z",
}

test("resource search keeps matching results and rejects an absent token", () => {
  expect(resourceFilter([resource], "E2E Disposable Resource 20260918 A EDITED", resourceFilterCreate())).toEqual([
    resource,
  ])
  expect(resourceFilter([resource], "definitelyabsenttoken", resourceFilterCreate())).toEqual([])
})

test("cleared resource search returns the resource", () => {
  expect(resourceFilter([resource], "", resourceFilterCreate())).toEqual([resource])
})
