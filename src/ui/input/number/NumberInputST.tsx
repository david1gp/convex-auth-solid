import { ttl1 } from "#src/app/i18n/ttl.ts"
import { tbDecreaseByX } from "#src/ui/input/number/i18n/tbDecreaseByX.ts"
import { tbIncreaseByX } from "#src/ui/input/number/i18n/tbIncreaseByX.ts"
import { NumberInputS, type NumberInputSProps } from "#ui/input/number/NumberInputS.jsx"
import type { NumberInputText } from "#ui/input/number/NumberInputTexts.jsx"

export function NumberInputST(p: Omit<NumberInputSProps, "texts">) {
  const texts: NumberInputText = {
    decreaseByX: (amount: number) => ttl1(tbDecreaseByX, amount.toString()),
    increaseByX: (amount: number) => ttl1(tbIncreaseByX, amount.toString()),
  }
  return <NumberInputS texts={texts} {...p} />
}
