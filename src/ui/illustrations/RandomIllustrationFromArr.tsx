import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { classInvertBlack } from "~ui/static/img/classInvertBlack"
import { Img } from "~ui/static/img/Img"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface RandomIllustrationFromArrProps extends MayHaveClass {
  images: string[]
  addIndex?: number
  alt: string
}

export function RandomIllustrationFromArr(p: RandomIllustrationFromArrProps) {
  const i = getIndex(p.images.length, p.addIndex)
  const src = p.images[i]
  if (!src) return null
  return (
    <Img
      alt={p.alt}
      src={src}
      class={classMerge(
        "select-none pointer-events-none", // ignore mouse
        classInvertBlack, // illustrations
        "w-full mx-auto", // w
        p.class,
      )}
    />
  )
}

function getIndex(max: number, addIndex = 0) {
  const date = new Date()
  const i = ((isDevEnvVite() ? date.getMilliseconds() : date.getHours()) + addIndex) % max
  return i
}
