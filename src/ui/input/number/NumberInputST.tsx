import { ttl1 } from "#src/app/i18n/ttl.js"
import { tbDecreaseByX } from "#src/ui/input/number/i18n/tbDecreaseByX.js"
import { tbIncreaseByX } from "#src/ui/input/number/i18n/tbIncreaseByX.js"
import { NumberInputS, type NumberInputSProps } from "#ui/input/number/NumberInputS"
import type { NumberInputText } from "#ui/input/number/NumberInputTexts"

export function NumberInputST(p: Omit<NumberInputSProps, "texts">) {
  const texts: NumberInputText = {
    decreaseByX: (amount: number) => ttl1(tbDecreaseByX, amount.toString()),
    increaseByX: (amount: number) => ttl1(tbIncreaseByX, amount.toString()),
  }
  return <NumberInputS texts={texts} {...p} />
}
