import { ttl1 } from "@/app/i18n/ttl"
import { tbDecreaseByX } from "@/ui/input/number/i18n/tbDecreaseByX"
import { tbIncreaseByX } from "@/ui/input/number/i18n/tbIncreaseByX"
import { NumberInputS, type NumberInputSProps } from "~ui/input/number/NumberInputS"
import type { NumberInputText } from "~ui/input/number/NumberInputTexts"

export function NumberInputST(p: Omit<NumberInputSProps, "texts">) {
  const texts: NumberInputText = {
    decreaseByX: (amount: number) => ttl1(tbDecreaseByX, amount.toString()),
    increaseByX: (amount: number) => ttl1(tbIncreaseByX, amount.toString()),
  }
  return <NumberInputS texts={texts} {...p} />
}
