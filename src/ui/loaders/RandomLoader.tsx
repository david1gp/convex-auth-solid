// import { LoaderShuffle4Dots } from "#ui/static/loaders/LoaderShuffle4Dots"
// import { LoaderShuffle9Squares } from "#ui/static/loaders/LoaderShuffle9Squares"
// import { LoaderSpin4Square } from "#ui/static/loaders/LoaderSpin4Square"
import { LoaderShuffle4Dots } from "#src/ui/loaders/LoaderShuffle4Dots.js"
import { LoaderShuffle9Squares } from "#src/ui/loaders/LoaderShuffle9Squares.js"
import { LoaderSpin4Square } from "#src/ui/loaders/LoaderSpin4Square.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"

export function RandomLoader(p: MayHaveClass) {
  const i = new Date().getSeconds() % 3
  switch (i) {
    default:
      return <LoaderShuffle9Squares class={p.class} />
    case 1:
      return <LoaderShuffle4Dots class={p.class} />
    case 2:
      return <LoaderSpin4Square class={p.class} />
  }
}
