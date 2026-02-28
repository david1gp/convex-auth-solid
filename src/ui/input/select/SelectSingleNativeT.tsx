import { ttl } from "@/app/i18n/ttl"
import { tbNoEntries } from "@/ui/input/select/i18n/tbNoEntries"
import { SelectSingleNative, type SelectSingleNativeProps } from "~ui/input/select/SelectSingleNative"
import type { SelectSingleNativeTexts } from "~ui/input/select/SelectSingleNativeTexts"

export function SelectSingleNativeT(p: Omit<SelectSingleNativeProps, "texts">) {
  const texts: SelectSingleNativeTexts = {
    noEntries: ttl(tbNoEntries),
  }
  return <SelectSingleNative texts={texts} {...p} />
}
