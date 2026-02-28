import { Icon } from "~ui/static/icon/Icon"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface IconTextPairProps extends MayHaveClass {
  icon: string
  class?: string
  children: any
}

export function IconTextPair(p: IconTextPairProps) {
  return (
    <div class={classMerge("flex items-center gap-2", p.class)}>
      <Icon path={p.icon} class="size-5" />
      {p.children}
    </div>
  )
}
