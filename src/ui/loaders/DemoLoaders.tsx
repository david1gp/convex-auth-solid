import { LoaderShuffle4Dots } from "@/ui/loaders/LoaderShuffle4Dots"
import { LoaderShuffle9Squares } from "@/ui/loaders/LoaderShuffle9Squares"
import { LoaderSpin4Square } from "@/ui/loaders/LoaderSpin4Square"
import type { HasClass } from "~ui/utils/HasClass"

export function DemoLoaders(p: HasClass) {
  return (
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-center">
      <LoaderShuffle9Squares class={p.class} />
      <LoaderShuffle4Dots class={p.class} />
      <LoaderSpin4Square class={p.class} />
    </div>
  )
}
