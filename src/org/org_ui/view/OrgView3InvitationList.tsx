import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { For, Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { orgPageSection } from "./orgPageSection"

export interface OrgInvitationsProps extends MayHaveClass {
  invitations: DocOrgInvitation[]
}

export function OrgView3InvitationList(p: OrgInvitationsProps) {
  return (
    <section id={orgPageSection.invitations} class={classMerge("space-y-4", p.class)}>
      <h2 class="text-xl font-semibold">Invitations</h2>
      <Show when={p.invitations.length > 0} fallback={<p class="text-muted-foreground">{ttt("No invitations yet")}</p>}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.invitations}>{(invitation) => <OrgInvitation invitation={invitation} />}</For>
        </div>
      </Show>
    </section>
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
