import { ttl, ttl1 } from "@/app/i18n/ttl"
import { tbAddEntry } from "@/ui/input/select/i18n/tbAddEntry"
import { tbNoEntries } from "@/ui/input/select/i18n/tbNoEntries"
import { tbRemoveX } from "@/ui/input/select/i18n/tbRemoveX"
import { SelectMultiple, type SelectMultipleProps } from "~ui/input/select/SelectMultiple"
import type { SelectMultipleTexts } from "~ui/input/select/SelectMultipleTexts"

export function SelectMultipleT(p: Omit<SelectMultipleProps, "texts">) {
  const texts: SelectMultipleTexts = {
    removeX: (x: string) => ttl1(tbRemoveX, x),
    addEntry: ttl(tbAddEntry),
    noEntries: ttl(tbNoEntries),
  }
  return <SelectMultiple texts={texts} {...p} />
}
