import { mdiArrowLeft } from "@mdi/js"
import { splitProps } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon, type ButtonIconProps } from "~ui/interactive/button/ButtonIcon"

export function GoBackLinkButton(p: Omit<ButtonIconProps, "href" | "onClick">) {
  const [s, rest] = splitProps(p, ["icon", "children", "variant"])
  return (
    <ButtonIcon
      icon={s.icon ?? mdiArrowLeft}
      onClick={() => {
        history.back()
      }}
      variant={s.variant ?? buttonVariant.outline}
      {...rest}
    >
      {ttt("Go back")}
    </ButtonIcon>
  )
}
