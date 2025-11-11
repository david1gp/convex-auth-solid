import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface AuthMiniHeroProps extends MayHaveClass {
  headerClass?: string
  subtitleClass?: string
}

export function AuthMiniHero(p: AuthMiniHeroProps) {
  const underlineClass = "underline underline-offset-2 sm:decoration-3"
  return (
    <h1 class={classMerge("font-bold max-w-5xl mx-auto", p.class)}>
      <div class="text-2xl md:text-4xl">
        Welcome to <span class="text-primary">LEG.TJ</span>
      </div>
      <div class="text-xl sm:text-2xl mt-2">
        The national platform that connects <span class={underlineClass}>government</span> and development{" "}
        <span class={underlineClass}>partners</span> to plan, track, and improve{" "}
        <span class={underlineClass}>education</span> support in <span class={underlineClass}>Tajikistan</span>.
      </div>
    </h1>
  )
}
