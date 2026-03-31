import { ttc } from "#src/app/i18n/ttc.ts"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import { constructOrgRecord } from "#src/resource/ui/org/constructOrgRecord.tsx"
import { CheckSingle } from "#ui/input/check/CheckSingle.jsx"
import type { createSignalObject } from "#ui/utils/createSignalObject.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { createEffect } from "solid-js"

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
