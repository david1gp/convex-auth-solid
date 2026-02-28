import type { ResourceType } from "@/resource/model_field/resourceType"
import { resourceTypeGetText } from "@/resource/model_field/resourceTypeGetText"
import { BadgeSoft } from "@/ui/badge/BadgeSoft"
import { mdiTag } from "@mdi/js"
import { Show } from "solid-js"
import { Icon } from "~ui/static/icon/Icon"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
