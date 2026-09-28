import { resourcePageDemoFixturesGet } from "#src/resource/ui/demo/resourcePageDemoFixturesGet.ts"
import { resourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function resourcePageDemoEditStateCreate(resourceId: string) {
  const fixtures = resourcePageDemoFixturesGet()
  const resource = () => fixtures.get(resourceId)
  const saved = createSignalObject(false)
  const form = resourceFormStateManagement(formMode.edit, resourceId, resource(), undefined, {
    persist: false,
    actions: {
      edit: async (data) => {
        fixtures.edit(resourceId, data)
        saved.set(true)
      },
    },
  })
  return { form, resource, saved: saved.get }
}
