import { classMerge } from "~ui/utils/classMerge"
import type { HasTitle } from "~ui/utils/HasTitle"
import type { MayHaveChildrenAndClass } from "~ui/utils/MayHaveChildrenAndClass"
import type { MayHaveSubtitle } from "~ui/utils/MayHaveSubtitle"

export interface PageHeaderProps extends HasTitle, MayHaveSubtitle, MayHaveChildrenAndClass {}

export function PageHeader(p: PageHeaderProps) {
  return (
    <header class={p.class}>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h1 class={classMerge("text-2xl font-semibold", p.titleClass)}>{p.title}</h1>
        {p.children}
      </div>
      {p.subtitle && <p class={classMerge("text-lg mb-4", p.subtitleClass)}>{p.subtitle}</p>}
    </header>
  )
}
