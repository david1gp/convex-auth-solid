import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import { resourcePageDemoFixturesGet } from "#src/resource/ui/demo/resourcePageDemoFixturesGet.ts"
import { resourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function resourcePageDemoAddStateCreate() {
  const fixtures = resourcePageDemoFixturesGet()
  const createdHref = createSignalObject<string | undefined>(undefined)
  const form = resourceFormStateManagement(formMode.add, undefined, undefined, undefined, {
    persist: false,
    actions: {
      create: async (data) => {
        const resource = fixtures.add(data)
        createdHref.set(pageDemoHref("/resources/:resourceId", { resourceId: resource.resourceId }))
      },
    },
  })
  return { form, createdHref: createdHref.get }
}
