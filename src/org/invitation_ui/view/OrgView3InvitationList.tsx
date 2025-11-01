import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { orgInvitationShowRole } from "@/org/invitation_model/orgInvitationShowRole"
import { OrgInvitationStatusView } from "@/org/invitation_ui/view/OrgInvitationStatusView"
import { invitationDocToStatus } from "@/org/invitation_ui/view/orgInvitationStatus"
import { urlOrgInvitationAdd } from "@/org/invitation_url/urlOrgInvitation"
import type { OrgViewPageType } from "@/org/org_model/OrgViewPageType"
import { mdiClose } from "@mdi/js"
import { For, Show, splitProps } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formIcon } from "~ui/input/form/getFormIcon"
import { ButtonIconOnly } from "~ui/interactive/button/ButtonIconOnly"
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
          <For each={p.invitations}>{(invitation) => <OrgInvitation {...rest} invitation={invitation} />}</For>
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

interface OrgInvitationProps extends OrgInvitationsProps, MayHaveClass {
  invitation: DocOrgInvitation
}

function OrgInvitation(p: OrgInvitationProps) {
  return (
    <div
      class={classMerge(
        "flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-500 rounded-lg bg-gray-50 dark:bg-stone-800",
        p.class,
      )}
    >
      <div class="flex-1 flex flex-col gap-2">
        <div class="text-lg font-medium">{p.invitation.invitedEmail}</div>

        {orgInvitationShowRole && (
          <div class="text-muted-foreground capitalize">
            <span>{ttt("Role:")}</span>
            {p.invitation.role}
          </div>
        )}

        <OrgInvitationStatusView {...invitationDocToStatus(p.invitation)} />
      </div>
      <ButtonIconOnly variant={buttonVariant.ghost} icon={mdiClose} title={ttt("Dismiss Invitation")}></ButtonIconOnly>
    </div>
  )
}
