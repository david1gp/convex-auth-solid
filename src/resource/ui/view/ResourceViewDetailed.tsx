import { ttc } from "#src/app/i18n/ttc.js"
import type { HasResourceModel } from "#src/resource/model/HasResourceModel.js"
import { ResourceTypeBadge } from "#src/resource/ui/view/ResourceTypeBadge.jsx"
import { urlResourceEdit } from "#src/resource/url/urlResource.js"
import { PageHeader } from "#src/ui/header/PageHeader.jsx"
import { MetaSectionDisplay } from "#src/ui/section/MetaSectionDisplay.jsx"
import { MetaSectionSummary } from "#src/ui/section/MetaSectionSummary.jsx"
import { MetaSectionTechnical } from "#src/ui/section/MetaSectionTechnical.jsx"
import { formModeIcon } from "#ui/input/form/formModeIcon.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { LinkButtonIconOnly } from "#ui/interactive/link/LinkButtonIconOnly.jsx"
import { classesGridCols3xl } from "#ui/static/grid/classesGridCols.js"
import { classArr } from "#ui/utils/classArr.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { Show, splitProps } from "solid-js"

export interface ResourceViewProps extends HasResourceModel, MayHaveClass {
  showCardWrapper?: boolean
  showMetaDates?: boolean
}

export function ResourceViewDetailed(p: ResourceViewProps) {
  const [s, rest] = splitProps(p, ["class"])
  return (
    <div class={classArr(classesGridCols3xl, "gap-4", s.class)}>
      <ShowImage {...rest} />
      <Header {...rest} />
      <MetaSectionSummary description={rest.resource.description} />
      <MetaSectionTechnical
        id={p.resource.resourceId}
        updatedAt={p.resource.updatedAt}
        createdAt={p.resource.createdAt}
      />
    </div>
  )
}

function ShowImage(p: ResourceViewProps) {
  return (
    <Show when={p.resource.image}>
      <img
        src={p.resource.image!}
        alt={ttc("Image for ") + (p.resource.name || "Resource")}
        class={classArr("max-w-xl h-auto rounded-xl", "col-span-full mx-auto", p.class)}
      />
    </Show>
  )
}

function Header(p: ResourceViewProps) {
  return (
    <PageHeader
      title={p.resource.name || "Untitled Resource"}
      titleClass="text-2xl sm:text-4xl font-bold"
      class="col-span-full mx-auto"
      subtitleChildren={
        <MetaSectionDisplay visibility={p.resource.visibility} language={p.resource.language}>
          <ResourceTypeBadge type={p.resource.type} />
        </MetaSectionDisplay>
      }
    >
      <LinkButtonIconOnly
        href={urlResourceEdit(p.resource.resourceId)}
        variant={buttonVariant.ghost}
        icon={formModeIcon.edit}
        title={ttc("Edit")}
      />
    </PageHeader>
  )
}
