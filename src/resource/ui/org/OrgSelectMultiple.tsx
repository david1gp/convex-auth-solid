import { ttc } from "@/app/i18n/ttc"
import type { OrgModel } from "@/org/org_model/OrgModel"
import { constructOrgRecord } from "@/resource/ui/org/constructOrgRecord"
import { createEffect } from "solid-js"
import { CheckMultiple } from "~ui/input/check/CheckMultiple"
import type { createSignalObject } from "~ui/utils/createSignalObject"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface OrgSelectMultipleProps extends MayHaveClass {
  valueSignal: ReturnType<typeof createSignalObject<string[]>>
  orgOptions: OrgModel[]
}

export function OrgSelectMultiple(p: OrgSelectMultipleProps) {
  let idNameRecord = constructOrgRecord(p.orgOptions)

  createEffect(() => {
    const options = p.orgOptions
    if (!options) return
    idNameRecord = constructOrgRecord(p.orgOptions)
  })

  function getOptions() {
    return p.orgOptions.map((o) => o.orgHandle)
  }

  function valueText(value: string) {
    return idNameRecord[value] ?? ttc("Untitled")
  }

  return (
    <CheckMultiple valueSignal={p.valueSignal} getOptions={getOptions} valueText={valueText} optionClass="bg-gray-50" />
  )
}
