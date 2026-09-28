import { For, Show } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { WorkspaceInvitationModel } from "#src/workspace/invitation_model/WorkspaceInvitationModel.ts"
import { WorkspaceInvitationListHeader } from "#src/workspace/invitation_ui/list/WorkspaceInvitationListHeader.tsx"
import { WorkspaceInvitationCard } from "#src/workspace/invitation_ui/view/WorkspaceInvitationCard.tsx"

interface WorkspaceInvitationListViewProps {
  invitations: () => WorkspaceInvitationModel[]
  addHref: string
  showHeader?: boolean
  acceptHref?: (code: string) => string
  onResend?: (code: string) => void
  onDismiss?: (code: string) => void
  page: () => number
  canPrevious: () => boolean
  canNext: () => boolean
  previous: () => void
  next: () => void
  loading: () => boolean
}

export function WorkspaceInvitationListView(p: WorkspaceInvitationListViewProps) {
  return (
    <>
      <Show when={p.showHeader !== false}>
        <WorkspaceInvitationListHeader addHref={p.addHref} />
      </Show>
      <Show when={p.invitations().length > 0} fallback={<NoData noDataText={ttc("No Workspace Invitations")} />}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.invitations()}>
            {(invitation) => (
              <WorkspaceInvitationCard
                invitation={invitation}
                acceptHref={p.acceptHref?.(invitation.invitationCode)}
                onResend={p.onResend}
                onDismiss={p.onDismiss}
              />
            )}
          </For>
        </div>
      </Show>
      <Show when={p.invitations().length > 0}>
        <PaginationControls
          page={p.page}
          canPrevious={p.canPrevious}
          canNext={p.canNext}
          previous={p.previous}
          next={p.next}
          loading={p.loading}
        />
      </Show>
    </>
  )
}
