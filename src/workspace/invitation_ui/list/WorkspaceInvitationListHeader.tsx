import { mdiPlus } from "@adaptive-ds/mdi/mdiPlus.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"

export function WorkspaceInvitationListHeader(p: { addHref: string }) {
  return (
    <PageHeader
      title={ttc("Workspace Invitations")}
      subtitle={ttc("Manage invitations of this workspace")}
      class="mb-4"
    >
      <LinkButtonInternal icon={mdiPlus} to={p.addHref} variant={buttonVariant.filledGreen}>
        {ttc("Add Invitation")}
      </LinkButtonInternal>
    </PageHeader>
  )
}
