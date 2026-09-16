import type { Accessor } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { Button } from "#ui/interactive/button/Button.jsx"
import { buttonSize, buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

interface PaginationControlsProps extends MayHaveClass {
  page: Accessor<number>
  canPrevious: Accessor<boolean>
  canNext: Accessor<boolean>
  previous: () => void
  next: () => void
  loading?: Accessor<boolean>
}

export function PaginationControls(p: PaginationControlsProps) {
  return (
    <div class={classMerge("flex items-center justify-center gap-2", p.class)}>
      <Button
        variant={buttonVariant.subtle}
        size={buttonSize.sm}
        onClick={p.previous}
        disabled={p.loading?.() || !p.canPrevious()}
      >
        {ttc("Previous")}
      </Button>
      <span class="text-sm text-muted-foreground" aria-live="polite">
        {ttc("Page")} {p.page()}
      </span>
      <Button
        variant={buttonVariant.subtle}
        size={buttonSize.sm}
        onClick={p.next}
        disabled={p.loading?.() || !p.canNext()}
      >
        {ttc("Next")}
      </Button>
    </div>
  )
}
