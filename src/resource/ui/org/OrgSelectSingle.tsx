import { ttc } from "@/app/i18n/ttc"
import type { OrgModel } from "@/org/org_model/OrgModel"
import { constructOrgRecord } from "@/resource/ui/org/constructOrgRecord"
import { createEffect } from "solid-js"
import { CheckSingle } from "~ui/input/check/CheckSingle"
import type { createSignalObject } from "~ui/utils/createSignalObject"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface OrgSelectSingleProps extends MayHaveClass {
  valueSignal: ReturnType<typeof createSignalObject<string>>
  orgOptions: OrgModel[]
}

export function OrgSelectSingle(p: OrgSelectSingleProps) {
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
    <CheckSingle valueSignal={p.valueSignal} getOptions={getOptions} valueText={valueText} optionClass="bg-gray-50" />
  )
}
