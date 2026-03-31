import { ttl } from "#src/app/i18n/ttl.ts"
import { tbIsRequired } from "#src/ui/input/i18n/tbIsRequired.ts"
import { LabelAsterix, type LabelAsterixProps } from "#ui/input/label/LabelAsterix.jsx"
import type { LabelAsterixTexts } from "#ui/input/label/LabelAsterixTexts.ts"

export function LabelAsterixT(p: Omit<LabelAsterixProps, "textes">) {
  const texts: LabelAsterixTexts = {
    isRequired: ttl(tbIsRequired),
  }
  return <LabelAsterix texts={texts} {...p} />
}
