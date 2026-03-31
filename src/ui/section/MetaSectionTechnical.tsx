import { ttc } from "#src/app/i18n/ttc.ts"
import { sharedMetaSection, sharedMetaSectionIcon } from "#src/app/tabs/sharedMetaSection.ts"
import { sharedMetaSectionGetText } from "#src/app/tabs/sharedMetaSectionGetText.ts"
import { DateView } from "#src/ui/date/DateView.tsx"
import { MetaFieldChildren } from "#src/ui/section/MetaFieldChildren.tsx"
import { MetaSection } from "#src/ui/section/MetaSection.tsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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
