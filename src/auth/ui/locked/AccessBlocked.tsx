import { LogoutButton } from "@/app/nav/LogoutButton"
import { NavStatic } from "@/app/nav/NavStatic"
import { urlSupportMailTo, urlSupportTelegram } from "@/app/url/urlSupport"
import { DeleteEarlierSessions } from "@/auth/ui/sign_in/existing/DeleteEarlierSessions"
import { mdiArrowULeftTop, mdiEmail } from "@mdi/js"
import { For } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { LayoutWrapperDemo } from "~ui/static/container/LayoutWrapperDemo"
import { iconTelegram } from "~ui/static/icons/iconTelegram"
import { SuccessPage } from "~ui/static/pages/SuccessPage"

export function AccessBlocked() {
  const ps = () => [
    ttt("Access is is granted by invitation."),
    ttt("Here are the steps:"),
    ttt("1. Please contact us via Email or Telegram below explaining who you are."),
    ttt("2. Please wait patiently to receive an Invitation by Email."),
    ttt("3. Open the invitation URL and Accept the invite."),
  ]
  return (
    <LayoutWrapperDemo title={ttt("Access Blocked")}>
      <NavStatic dense={false} />
      <SuccessPage title={ttt("Thank you for signing up")}>
        <For each={ps()}>{(p) => <p class="my-4">{p}</p>}</For>
        <LinkButton href={urlSupportMailTo} icon={mdiEmail} variant={buttonVariant.link} class="justify-start">
          {ttt("E-Mail")}
        </LinkButton>
        <LinkButton href={urlSupportTelegram} icon={iconTelegram} variant={buttonVariant.link} class="justify-start">
          {ttt("Telegram")}
        </LinkButton>
        <LogoutButton />
        <DeleteEarlierSessions icon={mdiArrowULeftTop} variant={buttonVariant.link}>
          {ttt("Reset")}
        </DeleteEarlierSessions>
      </SuccessPage>
    </LayoutWrapperDemo>
  )
}
