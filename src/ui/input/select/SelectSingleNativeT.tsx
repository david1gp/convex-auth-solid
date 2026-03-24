import { ttl } from "#src/app/i18n/ttl.js"
import { tbNoEntries } from "#src/ui/input/select/i18n/tbNoEntries.js"
import { SelectSingleNative, type SelectSingleNativeProps } from "#ui/input/select/SelectSingleNative.jsx"
import type { SelectSingleNativeTexts } from "#ui/input/select/SelectSingleNativeTexts.js"

export function SelectSingleNativeT(p: Omit<SelectSingleNativeProps, "texts">) {
  const texts: SelectSingleNativeTexts = {
    noEntries: ttl(tbNoEntries),
  }
  return <SelectSingleNative texts={texts} {...p} />
}
