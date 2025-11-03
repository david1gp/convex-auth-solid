import type { DocOrg } from "@/org/org_convex/IdOrg"
import { orgPageSection } from "@/org/org_ui/view/orgPageSection"
import { urlOrgEdit } from "@/org/org_url/urlOrg"
import { mdiHandWave } from "@mdi/js"
import { For, Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formIcon } from "~ui/input/form/getFormIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { Icon1 } from "~ui/static/icon/Icon1"
import { Img } from "~ui/static/img/Img"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface OrgViewProps extends MayHaveClass {
  org: DocOrg
  showEditButton: boolean
}

export function OrgViewInformation(p: OrgViewProps) {
  return (
    <section id={orgPageSection.org} class="text-center">
      <ShowImg {...p} />
      <h1 class="text-5xl font-bold mb-6 text-balance">{p.org.name}</h1>
      <ShowDescription {...p} />
      <ShowUrl {...p} />
      {p.showEditButton && (
        <LinkButton
          href={urlOrgEdit(p.org.orgHandle)}
          variant={buttonVariant.ghost}
          icon={formIcon.edit}
          class="flex mt-4"
        >
          {ttt("Edit")}
        </LinkButton>
      )}
    </section>
  )
}

function ShowImg(p: OrgViewProps) {
  return (
    <Show when={p.org.image}>
      {(getImageUrl) => (
        <Img
          src={getImageUrl() || "/placeholder.svg"}
          alt={ttt("Logo of ") + " " + p.org.name}
          class={classArr("h-40 rounded-xl mx-auto mb-6")}
        />
      )}
    </Show>
  )
}

function ImageFallBack() {
  return (
    <Icon1
      path={mdiHandWave}
      class={classArr(
        " mx-auto",
        "size-40", // size
        "p-6",
        "fill-white text-white bg-blue-400", // bg
        "rounded-4xl",
        // "ring-4 ring-blue-300", // ring
        "shadow-lg hover:shadow-xl", // shadow
      )}
    />
  )
}

function ShowDescription(p: OrgViewProps) {
  return (
    <Show when={p.org.description}>
      {(getDescription) => (
        <div class="text-lg mx-auto text-pretty mb-4">
          <Description description={getDescription()} />
        </div>
      )}
    </Show>
  )
}

function Description(p: { description: string }) {
  const lines = p.description.split("\n")
  return <For each={lines}>{(line) => <p>{line}</p>}</For>
}

function ShowUrl(p: OrgViewProps) {
  return (
    <Show when={p.org.url}>
      {(getUrl) => (
        <a
          href={getUrl()}
          class={classArr(
            "text-lg font-semibold",
            "text-black dark:text-white", // text color
            "underline decoration-2 underline-offset-4",
          )}
        >
          {getUrl()}
        </a>
      )}
    </Show>
  )
}
