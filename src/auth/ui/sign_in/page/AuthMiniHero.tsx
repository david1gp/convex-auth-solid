import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface AuthMiniHeroProps extends MayHaveClass {
  headerClass?: string
  subtitleClass?: string
}

export function AuthMiniHero(p: AuthMiniHeroProps) {
  return (
    <h1 class={classMerge("text-4xl md:text-6xl font-bold max-w-5xl mx-auto", p.class)}>
      <span class="text-primary">Adaptive Convex Auth</span>
      <span> is a lightweight authentication library built for </span>
      <span class="text-primary">Convex</span> and <span class="text-primary">Solid.js</span>
    </h1>
  )
}
