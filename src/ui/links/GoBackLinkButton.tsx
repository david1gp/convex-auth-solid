import { mdiArrowLeft } from "@mdi/js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import type { MayHaveButtonVariantAndClass } from "~ui/utils/MayHaveButtonVariantAndClass"

export function GoBackLinkButton(p: MayHaveButtonVariantAndClass) {
  return (
    <ButtonIcon
      icon={mdiArrowLeft}
      onClick={() => {
        history.back()
      }}
      variant={p.variant ?? buttonVariant.outline}
      class={p.class}
    >
      {ttt("Go back")}
    </ButtonIcon>
  )
}
