import { ttc } from "#src/app/i18n/ttc.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva"
import { ButtonIcon, type ButtonIconProps } from "#ui/interactive/button/ButtonIcon"
import { mdiArrowLeft } from "@mdi/js"
import { splitProps } from "solid-js"

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
      {ttc("Go back")}
    </ButtonIcon>
  )
}
