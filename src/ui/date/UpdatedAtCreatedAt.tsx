import { ttc } from "#src/app/i18n/ttc.js"
import { DateView } from "#src/ui/date/DateView.jsx"
import { TextWithHeadderVertical } from "#src/ui/date/TextWithHeadderVertical.jsx"
import { classArr } from "#ui/utils/classArr.js"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

export interface UpdatedAtCreatedAtProps extends MayHaveClass, MayHaveChildren {
  updatedAt: string
  createdAt: string
}

export function UpdatedAtCreatedAt(p: UpdatedAtCreatedAtProps) {
  return (
    <div class={classArr("flex flex-wrap sm:grid sm:grid-cols-3", "gap-4", p.class)}>
      {p.children}
      <TextWithHeadderVertical text={ttc("Updated At:")}>
        <DateView date={p.updatedAt} showAt={false} class="flex flex-col" />
      </TextWithHeadderVertical>
      <TextWithHeadderVertical text={ttc("Created At:")}>
        <DateView date={p.createdAt} showAt={false} class="flex flex-col" />
      </TextWithHeadderVertical>
    </div>
  )
}
