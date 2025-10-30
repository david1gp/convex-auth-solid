import { RandomIllustrationPopsy } from "@/ui/illustrations/RandomIllustrationPopsy"
import { classesCardWrapper } from "~ui/static/container/classesCardWrapper"
import { SeparatorWithText } from "~ui/static/separator/SeparatorWithText"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveChildrenAndClass } from "~ui/utils/MayHaveChildrenAndClass"
import type { MayHaveId } from "~ui/utils/MayHaveId"

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
