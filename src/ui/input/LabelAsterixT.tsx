import { ttl } from "@/app/i18n/ttl"
import { tbIsRequired } from "@/ui/input/i18n/tbIsRequired"
import { LabelAsterix, type LabelAsterixProps } from "~ui/input/label/LabelAsterix"
import type { LabelAsterixTexts } from "~ui/input/label/LabelAsterixTexts"

export function LabelAsterixT(p: Omit<LabelAsterixProps, "textes">) {
  const texts: LabelAsterixTexts = {
    isRequired: ttl(tbIsRequired),
  }
  return <LabelAsterix texts={texts} {...p} />
}
