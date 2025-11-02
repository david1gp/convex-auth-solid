import type { DocOrg } from "@/org/org_convex/IdOrg"
import { orgPageSection } from "@/org/org_ui/view/orgPageSection"
import { urlOrgEdit } from "@/org/org_url/urlOrg"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formIcon } from "~ui/input/form/getFormIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { LinkText } from "~ui/interactive/link/LinkText"
import { Img } from "~ui/static/img/Img"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface OrgViewProps extends MayHaveClass {
  org: DocOrg
}

export function OrgView1Information(p: OrgViewProps) {
  return (
    <section id={orgPageSection.org} class="">
      <Header {...p} />
      <div class="flex flex-wrap">
        <LeftSide {...p} />
        <RightSide {...p} />
      </div>
    </section>
  )
}

function Header(p: OrgViewProps) {
  return (
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-2xl font-semibold">{p.org.name}</h1>
      <LinkButton href={urlOrgEdit(p.org.orgHandle)} variant={buttonVariant.default} icon={formIcon.edit}>
        {ttt("Edit")}
      </LinkButton>
    </div>
  )
}

function LeftSide(p: OrgViewProps) {
  return (
    <div class="flex flex-col flex-1">
      <Show when={p.org.description}>{(getDescription) => <p class="text-lg mb-4">{getDescription()}</p>}</Show>
      <Show when={p.org.url}>{(getUrl) => <LinkText href={getUrl()}>{getUrl()}</LinkText>}</Show>
    </div>
  )
}

function RightSide(p: OrgViewProps) {
  return (
    <Show when={p.org.image}>
      {(getSrc) => <Img src={getSrc()} alt={`${p.org.name} logo`} class="max-w-[300px]" />}
    </Show>
  )
}
