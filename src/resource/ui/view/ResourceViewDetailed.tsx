import { ttc } from "@/app/i18n/ttc"
import type { HasResourceModel } from "@/resource/model/HasResourceModel"
import { ResourceTypeBadge } from "@/resource/ui/view/ResourceTypeBadge"
import { urlResourceEdit } from "@/resource/url/urlResource"
import { PageHeader } from "@/ui/header/PageHeader"
import { MetaSectionDisplay } from "@/ui/section/MetaSectionDisplay"
import { MetaSectionSummary } from "@/ui/section/MetaSectionSummary"
import { MetaSectionTechnical } from "@/ui/section/MetaSectionTechnical"
import { Show, splitProps } from "solid-js"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButtonIconOnly } from "~ui/interactive/link/LinkButtonIconOnly"
import { classesGridCols3xl } from "~ui/static/container/classesGridCols"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
