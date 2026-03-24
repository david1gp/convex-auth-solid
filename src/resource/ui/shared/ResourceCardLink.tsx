import { ttc } from "#src/app/i18n/ttc.js"
import type { ResourceModel } from "#src/resource/model/ResourceModel.js"
import { resourceTypeGetText } from "#src/resource/model_field/resourceTypeGetText.js"
import { urlResourceView } from "#src/resource/url/urlResource.js"
import { classesCard } from "#src/ui/card/classesCard.js"
import { IconTextPair } from "#src/ui/card/IconTextPair.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classMerge } from "#ui/utils/classMerge.js"
import { mdiTag } from "@mdi/js"
import { Show } from "solid-js"

export interface ResourceCardLinkProps {
  resource: ResourceModel
  class?: string
}

export function ResourceCardLink(p: ResourceCardLinkProps) {
  return (
    <LinkButton
      variant={buttonVariant.filled}
      href={urlResourceView(p.resource.resourceId)}
      class={classMerge(
        classesCard,
        "pl-4",
        // "flex flex-col gap-2",
        "grid grid-cols-1 gap-4",
        p.resource.image && "lg:grid-cols-2",
        p.class,
      )}
    >
      <div class="flex flex-col gap-1">
        <h3 class="text-lg font-semibold mb-2">{p.resource.name}</h3>

        <Show when={p.resource.type}>
          {(getType) => <IconTextPair icon={mdiTag}>{resourceTypeGetText(getType())}</IconTextPair>}
        </Show>
      </div>

      <Show when={p.resource.image}>
        <img src={p.resource.image!} alt={ttc("Resource image")} class="w-full max-h-25 object-cover rounded-lg" />
      </Show>
    </LinkButton>
  )
}
