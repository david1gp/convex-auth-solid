import { ttc } from "#src/app/i18n/ttc.ts"
import { SectionHeader } from "#src/ui/header/SectionHeader.tsx"
import type { WorkspaceMemberProfile } from "#src/workspace/member_model/WorkspaceMemberProfile.ts"
import { WorkspaceMemberCard } from "#src/workspace/member_ui/view/WorkspaceMemberCard.tsx"
import type { HasWorkspaceHandle } from "#src/workspace/workspace_model_field/HasWorkspaceHandle.ts"
import { workspacePageSection } from "#src/workspace/workspace_ui/view/workspacePageSection.tsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import { mdiAccountMultiple } from "@mdi/js"
import { For, Show } from "solid-js"

export interface WorkspaceMemberListProps extends HasWorkspaceHandle, MayHaveClass {
  members: WorkspaceMemberProfile[]
}

export function WorkspaceMemberListSection(p: WorkspaceMemberListProps) {
  const showMemberActionsNotImplemented = false
  return (
    <section id={workspacePageSection.members} class={classMerge("space-y-1", "my-2", p.class)}>
      <Header {...p} />
      <Show when={p.members.length > 0} fallback={<NoWorkspaceMembersText />}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.members}>
            {(member) => (
              <WorkspaceMemberCard showActions={showMemberActionsNotImplemented} workspaceHandle={p.workspaceHandle} member={member} />
            )}
          </For>
        </div>
      </Show>
    </section>
  )
}

function Header(p: WorkspaceMemberListProps) {
  return (
    <SectionHeader icon={mdiAccountMultiple} title={ttc("Workspace Members")}>
    </SectionHeader>
  )
}

function NoWorkspaceMembersText() {
  return <p class="text-muted-foreground">{ttc("No members yet")}</p>
}
