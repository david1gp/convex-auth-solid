import { ttc } from "#src/app/i18n/ttc.js"
import type { OrgModel } from "#src/org/org_model/OrgModel.js"
import { constructOrgRecord } from "#src/resource/ui/org/constructOrgRecord.jsx"
import { CheckMultiple } from "#ui/input/check/CheckMultiple.jsx"
import type { createSignalObject } from "#ui/utils/createSignalObject.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { createEffect } from "solid-js"

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
