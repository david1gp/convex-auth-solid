import { ttc } from "#src/app/i18n/ttc.js"
import { ResourceFileListLoader } from "#src/file/ui/list/ResourceFileListLoader.js"
import { ResourceFileAdd } from "#src/file/ui/mutate/ResourceFileAdd.js"
import type { HasResourceId } from "#src/resource/model/HasResourceId.js"
import { formMode } from "#ui/input/form/formMode"
import { classMerge } from "#ui/utils/classMerge"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"

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
