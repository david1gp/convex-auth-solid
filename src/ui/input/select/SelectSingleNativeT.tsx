import { ttl } from "#src/app/i18n/ttl.ts"
import { tbNoEntries } from "#src/ui/input/select/i18n/tbNoEntries.ts"
import { SelectSingleNative, type SelectSingleNativeProps } from "#ui/input/select/SelectSingleNative.jsx"
import type { SelectSingleNativeTexts } from "#ui/input/select/SelectSingleNativeTexts.ts"

export function SelectSingleNativeT(p: Omit<SelectSingleNativeProps, "texts">) {
  const texts: SelectSingleNativeTexts = {
    noEntries: ttl(tbNoEntries),
  }
  return <SelectSingleNative texts={texts} {...p} />
}
