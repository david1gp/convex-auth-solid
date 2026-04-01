import { ttc } from "#src/app/i18n/ttc.ts"
import { SectionHeader } from "#src/ui/header/SectionHeader.tsx"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { WorkspaceInvitationCard } from "#src/workspace/invitation_ui/view/WorkspaceInvitationCard.tsx"
import { urlWorkspaceInvitationAdd } from "#src/workspace/invitation_url/urlWorkspaceInvitation.ts"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import { workspacePageSection } from "#src/workspace/workspace_ui/view/workspacePageSection.tsx"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import { mdiEmail } from "@mdi/js"
import { For, Show, splitProps } from "solid-js"

export interface WorkspaceInvitationsProps extends HasWorkspaceHandle, MayHaveClass {
  invitations: WorkspaceInvitationModel[]
}

export function WorkspaceInvitationListSection(p: WorkspaceInvitationsProps) {
  const [s, rest] = splitProps(p, ["class"])
  return (
    <section id={workspacePageSection.invitations} class={classMerge("space-y-1", "my-2", s.class)}>
      <Header {...rest} />
      <Show when={p.invitations.length > 0} fallback={<NoWorkspaceInvitationsText />}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.invitations}>{(invitation) => <WorkspaceInvitationCard {...rest} invitation={invitation} />}</For>
        </div>
      </Show>
    </section>
  )
}

function NoWorkspaceInvitationsText() {
  return <p class="text-muted-foreground">{ttc("No invitations yet")}</p>
}

function Header(p: WorkspaceInvitationsProps) {
  return (
    <SectionHeader icon={mdiEmail} href={urlWorkspaceInvitationAdd(p.workspaceHandle)} title={ttc("Member Invitations")}>
      <LinkButton
        href={urlWorkspaceInvitationAdd(p.workspaceHandle)}
        variant={buttonVariant.subtle}
        icon={formModeIcon.add}
        class="hover:bg-gray-200"
      >
        {ttc("Invite Member")}
      </LinkButton>
    </SectionHeader>
  )
}
