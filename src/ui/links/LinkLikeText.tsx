import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"

export function LinkLikeText(p: MayHaveClassAndChildren) {
  return <span class={classMerge("p-3 font-medium", p.class)}>{p.children}</span>
}
