import { ttc } from "#src/app/i18n/ttc.js"
import { GoBackLinkButton } from "#src/ui/links/GoBackLinkButton.jsx"
import { GoHomeLinkButton } from "#src/ui/links/GoHomeLinkButton.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.js"
import type { MayHaveChildrenAndClass } from "#ui/utils/MayHaveChildrenAndClass.js"
import type { MayHaveId } from "#ui/utils/MayHaveId.js"
import type { MayHaveTitle } from "#ui/utils/MayHaveTitle.js"
import { mdiCrane } from "@mdi/js"

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
