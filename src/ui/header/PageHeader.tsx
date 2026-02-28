import type { JSXElement } from "solid-js"
import { Icon } from "~ui/static/icon/Icon"
import { classMerge } from "~ui/utils/classMerge"
import type { HasTitle } from "~ui/utils/HasTitle"
import type { MayHaveChildrenAndClass } from "~ui/utils/MayHaveChildrenAndClass"
import type { MayHaveIcon } from "~ui/utils/MayHaveIcon"
import type { MayHaveInnerClass } from "~ui/utils/MayHaveInnerClass"
import type { MayHaveSubtitle } from "~ui/utils/MayHaveSubtitle"

export interface PageHeaderProps
  extends HasTitle, MayHaveIcon, MayHaveSubtitle, MayHaveInnerClass, MayHaveChildrenAndClass {
  subtitleChildren?: JSXElement
}

export function PageHeader(p: PageHeaderProps) {
  return (
    <header class={classMerge("flex flex-col gap-2", p.class)}>
      <div class={classMerge("flex flex-wrap justify-between items-center gap-4", p.innerClass)}>
        {p.icon && <Icon path={p.icon} class={p.iconClass} />}
        <h1 class={classMerge("text-2xl font-semibold", p.titleClass)}>{p.title}</h1>
        {p.children}
      </div>
      {p.subtitle && <p class={classMerge("text-lg", p.subtitleClass)}>{p.subtitle}</p>}
      {p.subtitleChildren}
    </header>
  )
}
