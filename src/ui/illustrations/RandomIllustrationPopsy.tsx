import { ttc } from "#src/app/i18n/ttc.js"
import { illustrationPopsyValues } from "#src/ui/illustrations/illustrationsPopsy.js"
import { RandomIllustrationFromArr } from "#src/ui/illustrations/RandomIllustrationFromArr.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

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
