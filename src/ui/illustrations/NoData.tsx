import { RandomIllustrationPopsy } from "#src/ui/illustrations/RandomIllustrationPopsy.jsx"
import { classesCardWrapper } from "#ui/static/card/classesCardWrapper.js"
import { SeparatorWithText } from "#ui/static/separator/SeparatorWithText.jsx"
import { classMerge } from "#ui/utils/classMerge.js"
import type { MayHaveChildrenAndClass } from "#ui/utils/MayHaveChildrenAndClass.js"
import type { MayHaveId } from "#ui/utils/MayHaveId.js"

export interface NoDataProps extends MayHaveId, MayHaveChildrenAndClass {
  noDataText?: string
}

export function NoData(p: NoDataProps) {
  return (
    <>
      <section id={p.id} class={classMerge(classesCardWrapper, "lg:px-8", "col-span-full flex-1", p.class)}>
        <SeparatorWithText class={"text-3xl text-center py-6"}>
          <h2 class={"text-3xl m-4"}>{p.noDataText ?? "No Data"}</h2>
        </SeparatorWithText>
      </section>
      <RandomIllustrationPopsy class="max-w-3xl" />
    </>
  )
}
