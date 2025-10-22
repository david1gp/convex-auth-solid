import { getMailToContact } from "@/auth/ui/locked/getMailToContact"
import { For } from "solid-js"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { SuccessPage } from "~ui/static/pages/SuccessPage"

export function AccessBlocked() {
  const title = "Welcome Aboard!"
  // const subtitle = "Your registration is complete – let’s unlock the rest together."
  const subtitle = undefined
  const ps = [
    "Thank you for signing up. We're excited to have you on board and can't wait for you to experience what we're building.",
    "Access is currently invite-only while we polish the last details. Tap the button below to request your personal invite and we'll get back to you as soon as possible.",
  ]
  return (
    <SuccessPage title={title} subtitle={subtitle}>
      <For each={ps}>{(p) => <p class="my-4">{p}</p>}</For>
      <LinkButton href={getMailToContact()} class="w-full">
        Request access via Email
      </LinkButton>
    </SuccessPage>
  )
}
