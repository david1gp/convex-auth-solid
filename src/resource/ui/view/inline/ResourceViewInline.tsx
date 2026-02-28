import { ttc } from "@/app/i18n/ttc"
import type { HasResourceModel } from "@/resource/model/HasResourceModel"
import { ResourceTypeBadge } from "@/resource/ui/view/ResourceTypeBadge"
import { urlResourceEdit, urlResourceView } from "@/resource/url/urlResource"
import { UpdatedAtCreatedAt } from "@/ui/date/UpdatedAtCreatedAt"
import { MetaSectionSummary } from "@/ui/section/MetaSectionSummary"
import { Ps } from "@/ui/text/Ps"
import { Show, splitProps } from "solid-js"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { LinkButtonIconOnly } from "~ui/interactive/link/LinkButtonIconOnly"
import { classesCardWrapper } from "~ui/static/container/classesCardWrapper"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface ResourceViewInlineProps extends HasResourceModel, MayHaveClass {
  showCardWrapper?: boolean
  showMetaDates?: boolean
}

export function ResourceViewInline(p: ResourceViewInlineProps) {
  const [s, rest] = splitProps(p, ["class"])
  return (
    <div class={classArr("flex flex-col xl:flex-row flex-wrap gap-8", s.class)}>
      <Left {...rest} class="order-2 xl:order-1" />
      <Right {...rest} class="order-1 xl:order-2" />
    </div>
  )
}

function Left(p: ResourceViewInlineProps) {
  return (
    <div class={classArr("flex-1", "flex flex-col gap-4", p.class)}>
      <div
        class={classArr(
          p.showCardWrapper || p.showCardWrapper === undefined ? classesCardWrapper + " " + "shadow-md" : "",
          "flex-1",
          "flex flex-col gap-4",
        )}
      >
        <ShowName {...p} />
        <MetaSectionSummary description={p.resource.description} />
      </div>
      {/* <ShowDates {...p} /> */}
    </div>
  )
}

function Right(p: ResourceViewInlineProps) {
  return <ShowImage {...p} />
}

function ShowName(p: ResourceViewInlineProps) {
  return (
    <div class="flex flex-wrap justify-between items-center">
      <div>
        <h3>
          <LinkButton
            href={urlResourceView(p.resource.resourceId)}
            variant={buttonVariant.link}
            class={classArr("text-2xl font-bold", "pl-0")}
          >
            {p.resource.name ?? ttc("Unnamed Resource")}
          </LinkButton>
        </h3>
        <Show when={p.resource.description}>
          {(getDescription) => (
            <div class="text-pretty">
              <Ps text={getDescription()} />
            </div>
          )}
        </Show>
        <ResourceTypeBadge type={p.resource.type} class="w-content mt-2" />
      </div>
      <LinkButtonIconOnly
        href={urlResourceEdit(p.resource.resourceId)}
        variant={buttonVariant.ghost}
        icon={formModeIcon.edit}
        title={ttc("Edit")}
      />
    </div>
  )
}

function ShowDates(p: ResourceViewInlineProps) {
  return <UpdatedAtCreatedAt updatedAt={p.resource.updatedAt} createdAt={p.resource.createdAt} />
}

function ShowImage(p: ResourceViewInlineProps) {
  return (
    <Show when={p.resource.image}>
      {(getImageUrl) => (
        <img
          src={getImageUrl()}
          alt={ttc("Image for ") + (p.resource.name || "Resource")}
          class={classArr("max-w-xl h-auto rounded-xl", p.class)}
        />
      )}
    </Show>
  )
}
