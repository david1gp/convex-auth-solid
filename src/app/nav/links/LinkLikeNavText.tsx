import { classesActiveLink } from "@/app/nav/links/classesActiveLink"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"

export interface LinkLikeTextProps extends MayHaveClassAndChildren {
  isActive?: boolean
}

export function LinkLikeNavText(p: LinkLikeTextProps) {
  return (
    <span
      class={classMerge("p-3 font-medium", p.isActive && classesActiveLink, p.class)}
      aria-current={p.isActive ? "page" : undefined}
      aria-selected={p.isActive ? "true" : undefined}
      role="tab"
    >
      {p.children}
    </span>
  )
}
