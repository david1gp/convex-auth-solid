import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import type { ResourceFormData } from "#src/resource/ui/form/resourceFormStateManagement.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

const key = "resource-page-demo-fixtures"
const date = "2026-09-28T00:00:00.000Z"

/** One reactive in-memory collection for all resource demo routes. Never persists. */
export function resourcePageDemoFixturesGet() {
  const store = pageDemoFixtureStoreGet()
  const existing = store.get<ReturnType<typeof resourceFixturesCreate>>(key)
  if (existing) return existing
  const fixtures = resourceFixturesCreate()
  return store.set(key, fixtures)
}

function resourceFixturesCreate() {
  const resources = createSignalObject<ResourceModel[]>([
    {
      resourceId: "sample-resource-1",
      name: "Sample resource",
      description: "A sample resource for exploring the page gallery.",
      type: "strategy",
      visibility: "public",
      language: "en",
      image: "",
      createdAt: date,
      updatedAt: date,
    },
  ])
  return {
    resources: resources.get,
    get: (resourceId: string) => resources.get().find((resource) => resource.resourceId === resourceId),
    add(data: ResourceFormData) {
      const baseId = `demo-resource-${resources.get().length + 1}`
      let resourceId = baseId
      let suffix = 2
      while (resources.get().some((resource) => resource.resourceId === resourceId)) {
        resourceId = `${baseId}-${suffix++}`
      }
      const resource: ResourceModel = {
        resourceId,
        name: data.name,
        description: data.description,
        type: data.type,
        visibility: data.visibility,
        language: data.language,
        image: data.image,
        createdAt: date,
        updatedAt: date,
      }
      resources.set([...resources.get(), resource])
      return resource
    },
    edit(resourceId: string, data: Partial<ResourceFormData>) {
      const current = resources.get().find((resource) => resource.resourceId === resourceId)
      if (!current) return undefined
      const updated: ResourceModel = { ...current, ...data, updatedAt: date }
      resources.set(resources.get().map((resource) => (resource.resourceId === resourceId ? updated : resource)))
      return updated
    },
    remove(resourceId: string) {
      const current = resources.get().find((resource) => resource.resourceId === resourceId)
      if (!current) return undefined
      resources.set(resources.get().filter((resource) => resource.resourceId !== resourceId))
      return current
    },
  }
}
