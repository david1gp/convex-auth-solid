import { splitProps } from "solid-js"
import { classesBadgeSoft } from "#src/ui/badge/classesBadgeSoft.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import type { MayHaveChildrenAndClass } from "#ui/utils/MayHaveChildrenAndClass.ts"

export interface BasgeSoftProps extends MayHaveChildrenAndClass {}

export function BadgeSoft(p: BasgeSoftProps) {
  const [s, rest] = splitProps(p, ["class"])
  return <div class={classMerge(classesBadgeSoft, s.class)} {...rest} />
}
