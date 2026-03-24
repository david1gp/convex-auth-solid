import type { ResourceType } from "#src/resource/model_field/resourceType.js"
import { resourceTypeGetText } from "#src/resource/model_field/resourceTypeGetText.js"
import { BadgeSoft } from "#src/ui/badge/BadgeSoft.js"
import { Icon } from "#ui/static/icon/Icon"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
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
