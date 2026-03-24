import { ttc, ttc1 } from "#src/app/i18n/ttc.js"
import styles from "#src/ui/loaders/AnimateFadeIn.module.css"
import { RandomLoader } from "#src/ui/loaders/RandomLoader.jsx"
import { classesCardWrapperBorderDark } from "#ui/static/card/classesCardWrapper.js"
import { SeparatorWithText } from "#ui/static/separator/SeparatorWithText.jsx"
import { classMerge } from "#ui/utils/classMerge.js"
import type { MayHaveChildrenAndClass } from "#ui/utils/MayHaveChildrenAndClass.js"
import type { MayHaveId } from "#ui/utils/MayHaveId.js"
import type { MayHaveInnerClass } from "#ui/utils/MayHaveInnerClass.js"

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
