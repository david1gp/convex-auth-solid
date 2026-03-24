import { ttc } from "#src/app/i18n/ttc.js"
import { ResourceFileListLoader } from "#src/file/ui/list/ResourceFileListLoader.jsx"
import { ResourceFileAdd } from "#src/file/ui/mutate/ResourceFileAdd.jsx"
import type { HasResourceId } from "#src/resource/model/HasResourceId.js"
import { formMode } from "#ui/input/form/formMode.js"
import { classMerge } from "#ui/utils/classMerge.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

interface ResourceFilesSectionProps extends HasResourceId, MayHaveClass {}
export function ResourceFilesSection(p: ResourceFilesSectionProps) {
  return (
    <section class={classMerge("my-4", p.class)}>
      <h2 class="text-2xl font-semibold">{ttc("Manage Files")}</h2>
      <ResourceFileListLoader mode={formMode.add} resourceId={p.resourceId} />
      <ResourceFileAdd resourceId={p.resourceId} />
    </section>
  )
}
