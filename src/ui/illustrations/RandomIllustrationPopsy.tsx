import { illustrationPopsyValues } from "@/ui/illustrations/illustrationsPopsy"
import { RandomIllustrationFromArr } from "@/ui/illustrations/RandomIllustrationFromArr"
import { ttt } from "~ui/i18n/ttt"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface RandomIllustrationPopsyProps extends MayHaveClass {
  addIndex?: number
  alt?: string
}

export function RandomIllustrationPopsy(p: RandomIllustrationPopsyProps) {
  return (
    <RandomIllustrationFromArr
      images={illustrationPopsyValues}
      addIndex={p.addIndex}
      alt={p.alt ?? ttt("Illustration")}
      class={p.class}
    />
  )
}
