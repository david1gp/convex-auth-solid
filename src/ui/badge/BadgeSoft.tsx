import { classesBadgeSoft } from "@/ui/badge/classesBadgeSoft"
import { splitProps } from "solid-js"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveChildrenAndClass } from "~ui/utils/MayHaveChildrenAndClass"

export interface BasgeSoftProps extends MayHaveChildrenAndClass {}

export function BadgeSoft(p: BasgeSoftProps) {
  const [s, rest] = splitProps(p, ["class"])
  return <div class={classMerge(classesBadgeSoft, s.class)} {...rest} />
}
