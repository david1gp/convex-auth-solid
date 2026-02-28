import { ttc } from "@/app/i18n/ttc"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface AuthMiniHeroProps extends MayHaveClass {
  headerClass?: string
  subtitleClass?: string
}

export function AuthMiniHero(p: AuthMiniHeroProps) {
  return (
    <h1 class={classMerge("max-w-5xl mx-auto", p.class)}>
      <div class="text-2xl md:text-4xl font-bold">
        <span>{ttc("Welcome to")}</span>
        <span class="text-primary ml-1">{ttc("LEG.TJ")}</span>
      </div>
      <div class="text-lg mt-2 text-muted-foreground font-medium">
        {ttc(
          "The national platform that connects government and development partners to plan, track, and improve education support in Tajikistan.",
        )}
      </div>
    </h1>
  )
}
