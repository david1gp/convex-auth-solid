import { ttc } from "#src/app/i18n/ttc.ts"
import type { OrgInvitationModel } from "#src/org/invitation_model/OrgInvitationModel.ts"
import { OrgInvitationCard } from "#src/org/invitation_ui/view/OrgInvitationCard.tsx"
import { urlOrgInvitationAdd } from "#src/org/invitation_url/urlOrgInvitation.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import { orgPageSection } from "#src/org/org_ui/view/orgPageSection.tsx"
import { SectionHeader } from "#src/ui/header/SectionHeader.tsx"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import { mdiEmail } from "@mdi/js"
import { For, Show, splitProps } from "solid-js"

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
