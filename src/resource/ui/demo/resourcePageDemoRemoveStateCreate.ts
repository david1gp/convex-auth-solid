import { resourcePageDemoFixturesGet } from "#src/resource/ui/demo/resourcePageDemoFixturesGet.ts"
import { resourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function resourcePageDemoRemoveStateCreate(resourceId: string) {
  const fixtures = resourcePageDemoFixturesGet()
  const resource = () => fixtures.get(resourceId)
  const removed = createSignalObject(false)
  const form = resourceFormStateManagement(formMode.remove, resourceId, resource(), undefined, {
    persist: false,
    actions: {
      delete: async () => {
        fixtures.remove(resourceId)
        removed.set(true)
      },
    },
  })
  return { form, resource, removed: removed.get }
}
