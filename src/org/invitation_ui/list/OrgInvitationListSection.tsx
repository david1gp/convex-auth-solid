import { ttc } from "@/app/i18n/ttc"
import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { OrgInvitationCard } from "@/org/invitation_ui/view/OrgInvitationCard"
import { urlOrgInvitationAdd } from "@/org/invitation_url/urlOrgInvitation"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { SectionHeader } from "@/ui/header/SectionHeader"
import { mdiEmail } from "@mdi/js"
import { For, Show, splitProps } from "solid-js"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { orgPageSection } from "@/org/org_ui/view/orgPageSection"

export interface OrgInvitationsProps extends HasOrgHandle, MayHaveClass {
  invitations: OrgInvitationModel[]
}

export function OrgInvitationListSection(p: OrgInvitationsProps) {
  const [s, rest] = splitProps(p, ["class"])
  return (
    <section id={orgPageSection.invitations} class={classMerge("space-y-1", "my-2", s.class)}>
      <Header {...rest} />
      <Show when={p.invitations.length > 0} fallback={<NoOrgInvitationsText />}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.invitations}>{(invitation) => <OrgInvitationCard {...rest} invitation={invitation} />}</For>
        </div>
      </Show>
    </section>
  )
}

function NoOrgInvitationsText() {
  return <p class="text-muted-foreground">{ttc("No invitations yet")}</p>
}

function Header(p: OrgInvitationsProps) {
  return (
    <SectionHeader icon={mdiEmail} href={urlOrgInvitationAdd(p.orgHandle)} title={ttc("Member Invitations")}>
      <LinkButton
        href={urlOrgInvitationAdd(p.orgHandle)}
        variant={buttonVariant.subtle}
        icon={formModeIcon.add}
        class="hover:bg-gray-200"
      >
        {ttc("Invite Member")}
      </LinkButton>
    </SectionHeader>
  )
}
