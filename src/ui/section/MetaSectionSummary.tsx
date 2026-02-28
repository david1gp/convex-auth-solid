import { sharedMetaSection, sharedMetaSectionIcon } from "@/app/tabs/sharedMetaSection"
import { sharedMetaSectionGetText } from "@/app/tabs/sharedMetaSectionGetText"
import { MetaSection } from "@/ui/section/MetaSection"
import { Ps } from "@/ui/text/Ps"
import { Show } from "solid-js"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface MetaSectionSummaryProps extends MayHaveClass {
  description?: string
}

export function MetaSectionSummary(p: MetaSectionSummaryProps) {
  return (
    <Show when={p.description}>
      <MetaSection
        getTexts={sharedMetaSectionGetText}
        icons={sharedMetaSectionIcon}
        s={sharedMetaSection.description}
        class={classMerge("md:col-span-2", p.description && getRowSpanClass(p.description), p.class)}
      >
        <div class="text-pretty">
          <Ps text={p.description!} />
        </div>
      </MetaSection>
    </Show>
  )
}

function getRowSpanClass(description: string): string | undefined {
  const span = Math.min(Math.ceil(description.length / 600), 12)
  const classes: Record<number, string> = {
    2: "md:row-span-2",
    3: "md:row-span-3",
    4: "md:row-span-4",
    5: "md:row-span-5",
    6: "md:row-span-6",
    7: "md:row-span-7",
    8: "md:row-span-8",
    9: "md:row-span-9",
    10: "md:row-span-10",
    11: "md:row-span-11",
    12: "md:row-span-12",
  }
  return classes[span]
}
