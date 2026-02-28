import { ttc } from "@/app/i18n/ttc"
import { urlSupportMailTo, urlSupportTelegram } from "@/app/url/urlSupport"
import { mdiEmail, mdiHelpCircleOutline } from "@mdi/js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { CorvuPopoverIcon } from "~ui/interactive/popover/CorvuPopoverIcon"
import { iconTelegram } from "~ui/static/icons/iconTelegram"

import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface SupportPopoverProps extends MayHaveClass {}

export function SupportPopover(p: SupportPopoverProps) {
  const getTitle = () => ttc("Support")
  return (
    <CorvuPopoverIcon
      icon={mdiHelpCircleOutline}
      iconClass="size-7"
      variant={buttonVariant.ghost}
      class={p.class}
      title={getTitle()}
      innerClass="flex flex-col gap-2"
    >
      <h3 class="text-lg font-medium ml-3">{getTitle()}</h3>
      <LinkButton href={urlSupportMailTo} icon={mdiEmail} variant={buttonVariant.link} class="justify-start">
        {ttc("E-Mail")}
      </LinkButton>
      <LinkButton href={urlSupportTelegram} icon={iconTelegram} variant={buttonVariant.link} class="justify-start">
        {ttc("Telegram Group")}
      </LinkButton>
    </CorvuPopoverIcon>
  )
}
