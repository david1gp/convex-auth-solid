import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { urlOrgInvitationAdd } from "@/org/invitation_url/urlOrgInvitation"
import type { OrgViewPageType } from "@/org/org_model/OrgViewPageType"
import { For, Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formIcon } from "~ui/input/form/getFormIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { orgPageSection } from "./orgPageSection"

export interface OrgInvitationsProps extends Omit<OrgViewPageType, "members">, MayHaveClass {}

export function OrgView3InvitationList(p: OrgInvitationsProps) {
  return (
    <section id={orgPageSection.invitations} class={classMerge("space-y-4", p.class)}>
      <Header {...p} />
      <Show when={p.invitations.length > 0} fallback={<p class="text-muted-foreground">{ttt("No invitations yet")}</p>}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.invitations}>{(invitation) => <OrgInvitation invitation={invitation} />}</For>
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
        {ttt("Add")}
      </LinkButton>
    </div>
  )
}

interface OrgInvitationProps extends MayHaveClass {
  invitation: DocOrgInvitation
}

function OrgInvitation(p: OrgInvitationProps) {
  const status = () => {
    if (p.invitation.acceptedAt) return "Accepted"
    return "Pending"
  }

  const statusColor = () => {
    if (p.invitation.acceptedAt) return "text-green-600"
    return "text-yellow-600"
  }

  return (
    <div class={classMerge("flex items-center gap-3 p-4 border rounded-lg bg-card", p.class)}>
      <div class="flex-1">
        <div class="font-medium">{p.invitation.invitedEmail}</div>
        <div class="text-muted-foreground capitalize">
          <span>{ttt("Role:")}</span>
          {p.invitation.role}
        </div>
        <div class={classMerge("text-sm capitalize", statusColor())}>{status()}</div>
      </div>
    </div>
  )
}
