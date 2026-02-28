import { ttc } from "@/app/i18n/ttc"
import { GoBackLinkButton } from "@/ui/links/GoBackLinkButton"
import { GoHomeLinkButton } from "@/ui/links/GoHomeLinkButton"
import { mdiCrane } from "@mdi/js"
import { Icon } from "~ui/static/icon/Icon"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveChildrenAndClass } from "~ui/utils/MayHaveChildrenAndClass"
import type { MayHaveId } from "~ui/utils/MayHaveId"
import type { MayHaveTitle } from "~ui/utils/MayHaveTitle"

export interface TodoSectionProps extends MayHaveTitle, MayHaveId, MayHaveChildrenAndClass {
  iconClass?: string
}

export function TodoSection(p: TodoSectionProps) {
  return (
    <section id={p.id} class={classMerge("flex w-full items-center justify-center", p.class)}>
      <div class={"flex flex-col items-center"}>
        <Icon path={mdiCrane} class={p.iconClass ?? "size-40"} />
        {p.title && <h1 class={"mb-4 text-5xl"}>{p.title}</h1>}
        <h2 class={"mb-4 text-3xl"}>{ttc("Work in progress")}</h2>
        <p class={"text-xl"}>{ttc("The current section is still under development and therefore not yet available")}</p>
        <div class={"mt-6 flex flex-wrap items-center gap-1"}>
          <GoBackLinkButton />
          <GoHomeLinkButton />
        </div>
      </div>
    </section>
  )
}
