import { LoaderShuffle4Dots } from "#src/ui/loaders/LoaderShuffle4Dots.js"
import { LoaderShuffle9Squares } from "#src/ui/loaders/LoaderShuffle9Squares.js"
import { LoaderSpin4Square } from "#src/ui/loaders/LoaderSpin4Square.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"

export function DemoLoaders(p: MayHaveClass) {
  return (
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-center">
      <LoaderShuffle9Squares class={p.class} />
      <LoaderShuffle4Dots class={p.class} />
      <LoaderSpin4Square class={p.class} />
    </div>
  )
}
