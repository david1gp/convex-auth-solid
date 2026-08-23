import { mdiArrowLeft } from "@adaptive-ds/mdi/mdiArrowLeft.js"
import { splitProps } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { ButtonIcon, type ButtonIconProps } from "#ui/interactive/button/ButtonIcon.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"

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
