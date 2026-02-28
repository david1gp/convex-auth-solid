import { ttc } from "@/app/i18n/ttc"
import { sharedMetaSection, sharedMetaSectionIcon } from "@/app/tabs/sharedMetaSection"
import { sharedMetaSectionGetText } from "@/app/tabs/sharedMetaSectionGetText"
import { DateView } from "@/ui/date/DateView"
import { MetaFieldChildren } from "@/ui/section/MetaFieldChildren"
import { MetaSection } from "@/ui/section/MetaSection"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface MetaSectionTechnicalProps extends MayHaveClass {
  id: string
  updatedAt: string
  createdAt: string
}

export function MetaSectionTechnical(p: MetaSectionTechnicalProps) {
  return (
    <MetaSection
      icons={sharedMetaSectionIcon}
      getTexts={sharedMetaSectionGetText}
      s={sharedMetaSection.technical}
      class={p.class}
    >
      <div class="grid grid-cols-2 gap-4">
        {/* <MetaField heading={ttt("ID")} value={p.id} class="col-span-full" /> */}
        <MetaFieldChildren heading={ttc("Updated At")}>
          <DateView date={p.updatedAt} showAt={false} class="flex flex-col" />
        </MetaFieldChildren>
        <MetaFieldChildren heading={ttc("Created At")}>
          <DateView date={p.createdAt} showAt={false} class="flex flex-col" />
        </MetaFieldChildren>
      </div>
    </MetaSection>
  )
}
