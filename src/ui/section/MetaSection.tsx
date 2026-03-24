import { classesCard } from "#src/ui/card/classesCard.js"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.js"
import type { HasChildren } from "#ui/utils/HasChildren.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

export interface MetaSectionProps<T extends string> extends MayHaveClass, HasChildren {
  s: T
  getTexts: (section: string) => string
  icons: Record<T, string>
  headerClass?: string
}

export function MetaSection<T extends string>(p: MetaSectionProps<T>) {
  return (
    <section id={p.s} class={classMerge(classesCard, "flex flex-col gap-2", p.class)}>
      <div class={classMerge("flex items-center gap-2", "text-muted-foreground", p.headerClass)}>
        <Icon path={p.icons[p.s]} class="fill-gray-500 dark:fill-gray-500" />
        <h2 class={classMerge("text-lg font-semibold")}>{p.getTexts(p.s)}</h2>
      </div>
      {p.children}
    </section>
  )
}
