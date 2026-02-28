import { ttc, ttc1 } from "@/app/i18n/ttc"
import styles from "@/ui/loaders/AnimateFadeIn.module.css"
import { RandomLoader } from "@/ui/loaders/RandomLoader"
import { classesCardWrapperBorderDark } from "~ui/static/container/classesCardWrapper"
import { SeparatorWithText } from "~ui/static/separator/SeparatorWithText"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveChildrenAndClass } from "~ui/utils/MayHaveChildrenAndClass"
import type { MayHaveId } from "~ui/utils/MayHaveId"
import type { MayHaveInnerClass } from "~ui/utils/MayHaveInnerClass"

export interface LoadingSectionProps extends MayHaveId, MayHaveChildrenAndClass, MayHaveInnerClass {
  loadingText?: string
  loadingSubject?: string
  loaderClass?: string
}

export function LoadingSection(p: LoadingSectionProps) {
  return (
    <section
      id={p.id}
      class={classMerge(
        classesCardWrapperBorderDark,
        styles.animateFadeIn2s,
        "min-h-60", // h
        "flex flex-col items-center gap-4",
        p.class,
      )}
    >
      <SeparatorWithText>
        <h2 class={"text-3xl my-2"}>{getTitle(p.loadingText, p.loadingSubject)}</h2>
      </SeparatorWithText>
      <RandomLoader class={p.loaderClass} />
    </section>
  )
}

function getTitle(title?: string, titleSubject?: string): string {
  if (title) return title
  if (titleSubject) return ttc1("Loading [X]", titleSubject)
  return ttc("Loading...")
}
