import { classesBadgeSoft } from "#src/ui/badge/classesBadgeSoft.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import type { MayHaveChildrenAndClass } from "#ui/utils/MayHaveChildrenAndClass.ts"
import { splitProps } from "solid-js"

export interface BasgeSoftProps extends MayHaveChildrenAndClass {}

export function BadgeSoft(p: BasgeSoftProps) {
  const [s, rest] = splitProps(p, ["class"])
  return <div class={classMerge(classesBadgeSoft, s.class)} {...rest} />
}
