import { classMerge } from "#ui/utils/classMerge.js"
import type { HasChildren } from "#ui/utils/HasChildren.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

interface FieldChildrenProps extends MayHaveClass, HasChildren {
  heading: string
  headingClass?: string
}

export function MetaFieldChildren(p: FieldChildrenProps) {
  return (
    <div class={classMerge("flex flex-col gap-1", p.class)}>
      <span class={classMerge("text-muted-foreground font-medium", p.headingClass)}>{p.heading}</span>
      {p.children}
    </div>
  )
}
