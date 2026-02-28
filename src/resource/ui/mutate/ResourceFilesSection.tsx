import { ttc } from "@/app/i18n/ttc"
import { ResourceFileListLoader } from "@/file/ui/list/ResourceFileListLoader"
import { ResourceFileAdd } from "@/file/ui/mutate/ResourceFileAdd"
import type { HasResourceId } from "@/resource/model/HasResourceId"
import { formMode } from "~ui/input/form/formMode"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
