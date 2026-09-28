import { mdiAccountMultiple } from "@adaptive-ds/mdi/mdiAccountMultiple.js"
import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { For, Match, Switch } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { NoData } from "#src/ui/illustrations/NoData.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"

export function WorkspaceMemberListView(p: {
  members: () => WorkspaceMemberModel[] | undefined
  addHref: string
  editHref: (memberId: string) => string
  page: () => number
  canPrevious: () => boolean
  canNext: () => boolean
  previous: () => void
  next: () => void
  loading: () => boolean
}) {
  return (
    <>
      <PageHeader
        icon={mdiAccountMultiple}
        title={ttc("Workspace Members")}
        subtitle={ttc("Manage members of this workspace")}
        class="mb-4"
      >
        <LinkButtonInternal icon={mdiPlus} to={p.addHref} variant={buttonVariant.filledGreen}>
          {ttc("Add Member")}
        </LinkButtonInternal>
      </PageHeader>
      <Switch>
        <Match when={p.members() === undefined}>
          <LoadingSection loadingSubject={ttc("Workspace Members")} />
        </Match>
        <Match when={p.members()?.length === 0}>
          <NoData noDataText={ttc("No Members")} />
        </Match>
        <Match when={p.members()}>
          {(members) => (
            <>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <For each={members()}>
                  {(member) => (
                    <LinkButtonInternal to={p.editHref(member.memberId)}>{member.userId}</LinkButtonInternal>
                  )}
                </For>
              </div>
              <PaginationControls
                page={p.page}
                canPrevious={p.canPrevious}
                canNext={p.canNext}
                previous={p.previous}
                next={p.next}
                loading={p.loading}
              />
            </>
          )}
        </Match>
      </Switch>
    </>
  )
}
