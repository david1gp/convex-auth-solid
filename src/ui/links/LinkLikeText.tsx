import { classMerge } from "#ui/utils/classMerge.ts"
import type { MayHaveClassAndChildren } from "#ui/utils/MayHaveClassAndChildren.ts"

export function LinkLikeText(p: MayHaveClassAndChildren) {
  return <span class={classMerge("p-3 font-medium", p.class)}>{p.children}</span>
}
