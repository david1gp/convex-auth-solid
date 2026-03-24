import { classesBadgeSoft } from "#src/ui/badge/classesBadgeSoft.js"
import { classMerge } from "#ui/utils/classMerge"
import type { MayHaveChildrenAndClass } from "#ui/utils/MayHaveChildrenAndClass"
import { splitProps } from "solid-js"

export interface BasgeSoftProps extends MayHaveChildrenAndClass {}

export function BadgeSoft(p: BasgeSoftProps) {
  const [s, rest] = splitProps(p, ["class"])
  return <div class={classMerge(classesBadgeSoft, s.class)} {...rest} />
}
