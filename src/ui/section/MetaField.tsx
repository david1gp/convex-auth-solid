import { classMerge } from "#ui/utils/classMerge.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

interface FieldProps extends MayHaveClass {
  heading: string
  headingClass?: string
  value: string
  valueClass?: string
}

export function MetaField(p: FieldProps) {
  return (
    <div class={classMerge("flex flex-col gap-1", p.class)}>
      <span class={classMerge("text-muted-foreground font-medium", p.headingClass)}>{p.heading}</span>
      <span class={classMerge("font-medium", p.valueClass)}>{p.value}</span>
    </div>
  )
}
