import { ttl } from "#src/app/i18n/ttl.js"
import { tbIsRequired } from "#src/ui/input/i18n/tbIsRequired.js"
import { LabelAsterix, type LabelAsterixProps } from "#ui/input/label/LabelAsterix.jsx"
import type { LabelAsterixTexts } from "#ui/input/label/LabelAsterixTexts.js"

export function LabelAsterixT(p: Omit<LabelAsterixProps, "textes">) {
  const texts: LabelAsterixTexts = {
    isRequired: ttl(tbIsRequired),
  }
  return <LabelAsterix texts={texts} {...p} />
}
