import { OrgInvitationCard } from "@/org/invitation_ui/view/OrgInvitationCard"
import { urlOrgInvitationAdd } from "@/org/invitation_url/urlOrgInvitation"
import type { OrgViewPageType } from "@/org/org_model/OrgViewPageType"
import { For, Show, splitProps } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formIcon } from "~ui/input/form/getFormIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { orgPageSection } from "../../org_ui/view/orgPageSection"

export interface OrgInvitationsProps extends Omit<OrgViewPageType, "members">, MayHaveClass {}

export function OrgView3InvitationList(p: OrgInvitationsProps) {
  const [s, rest] = splitProps(p, ["class"])
  return (
    <section id={orgPageSection.invitations} class={classMerge("space-y-4", s.class)}>
      <Header {...rest} />
      <Show when={p.invitations.length > 0} fallback={<p class="text-muted-foreground">{ttt("No invitations yet")}</p>}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.invitations}>{(invitation) => <OrgInvitationCard {...rest} invitation={invitation} />}</For>
        </div>
      </Show>
    </section>
  )
}

function Header(p: OrgInvitationsProps) {
  return (
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-2xl font-semibold">{ttt("Invitations")}</h1>
      <LinkButton href={urlOrgInvitationAdd(p.org.orgHandle)} variant={buttonVariant.default} icon={formIcon.add}>
        {ttt("Invite Member")}
      </LinkButton>
    </div>
  )
}
