import { ttl, ttl1 } from "#src/app/i18n/ttl.ts"
import { tbAddEntry } from "#src/ui/input/select/i18n/tbAddEntry.ts"
import { tbNoEntries } from "#src/ui/input/select/i18n/tbNoEntries.ts"
import { tbRemoveX } from "#src/ui/input/select/i18n/tbRemoveX.ts"
import { SelectMultiple, type SelectMultipleProps } from "#ui/input/select/SelectMultiple.jsx"
import type { SelectMultipleTexts } from "#ui/input/select/SelectMultipleTexts.ts"

export function SelectMultipleT(p: Omit<SelectMultipleProps, "texts">) {
  const texts: SelectMultipleTexts = {
    removeX: (x: string) => ttl1(tbRemoveX, x),
    addEntry: ttl(tbAddEntry),
    noEntries: ttl(tbNoEntries),
  }
  return <SelectMultiple texts={texts} {...p} />
}
