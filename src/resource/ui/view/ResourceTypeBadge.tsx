import type { ResourceType } from "#src/resource/model_field/resourceType.ts"
import { resourceTypeGetText } from "#src/resource/model_field/resourceTypeGetText.ts"
import { BadgeSoft } from "#src/ui/badge/BadgeSoft.tsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { mdiTag } from "@mdi/js"
import { Show } from "solid-js"

export interface ResourceTypeBadgeProps extends MayHaveClass {
  type?: ResourceType
}

export function ResourceTypeBadge(p: ResourceTypeBadgeProps) {
  return (
    <Show when={p.type}>
      {(getType) => (
        <BadgeSoft class={p.class}>
          <Icon path={mdiTag} />
          <span>{resourceTypeGetText(getType())}</span>
        </BadgeSoft>
      )}
    </Show>
  )
}
