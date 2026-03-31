import { ttc } from "#src/app/i18n/ttc.ts"
import { illustrationPopsyValues } from "#src/ui/illustrations/illustrationsPopsy.ts"
import { RandomIllustrationFromArr } from "#src/ui/illustrations/RandomIllustrationFromArr.tsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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
