import { For } from "solid-js"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface PsProps extends MayHaveClass {
  text: string
}

export function Ps(p: PsProps) {
  const lines = p.text.split("\n")
  return <For each={lines}>{(line) => <p class={p.class}>{line}</p>}</For>
}
