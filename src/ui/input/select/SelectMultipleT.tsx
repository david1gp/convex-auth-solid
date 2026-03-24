import { ttl, ttl1 } from "#src/app/i18n/ttl.js"
import { tbAddEntry } from "#src/ui/input/select/i18n/tbAddEntry.js"
import { tbNoEntries } from "#src/ui/input/select/i18n/tbNoEntries.js"
import { tbRemoveX } from "#src/ui/input/select/i18n/tbRemoveX.js"
import { SelectMultiple, type SelectMultipleProps } from "#ui/input/select/SelectMultiple"
import type { SelectMultipleTexts } from "#ui/input/select/SelectMultipleTexts"

export function SelectMultipleT(p: Omit<SelectMultipleProps, "texts">) {
  const texts: SelectMultipleTexts = {
    removeX: (x: string) => ttl1(tbRemoveX, x),
    addEntry: ttl(tbAddEntry),
    noEntries: ttl(tbNoEntries),
  }
  return <SelectMultiple texts={texts} {...p} />
}
