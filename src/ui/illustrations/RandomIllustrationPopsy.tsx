import { ttc } from "@/app/i18n/ttc"
import { illustrationPopsyValues } from "@/ui/illustrations/illustrationsPopsy"
import { RandomIllustrationFromArr } from "@/ui/illustrations/RandomIllustrationFromArr"
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
      alt={p.alt ?? ttc("Illustration")}
      class={p.class}
    />
  )
}
