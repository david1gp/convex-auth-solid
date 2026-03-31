import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import type { DocOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.ts"
import { OrgInvitationForm } from "#src/org/invitation_ui/form/OrgInvitationForm.tsx"
import { orgInvitationFormStateManagement } from "#src/org/invitation_ui/form/orgInvitationFormStateManagement.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import type { HasOrgInvitationCode } from "#src/org/org_model_field/HasOrgInvitationCode.ts"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { Show, createEffect } from "solid-js"

interface OrgInvitationMutateProps extends HasOrgHandle, HasOrgInvitationCode, HasFormModeMutate, MayHaveClass {}

export function OrgInvitationMutate(p: OrgInvitationMutateProps) {
  const op = "OrgInvitationMutate"
  const getInvitation = createQuery(api.org.orgInvitationGetQuery, {
    orgHandle: p.orgHandle,
    invitationCode: p.invitationCode,
  }) as () => DocOrgInvitation | undefined

  const sm = orgInvitationFormStateManagement(p.mode, p.orgHandle, p.invitationCode)

  createEffect(() => {
    const invitation = getInvitation()
    if (!invitation) {
      return
    }
    sm.loadData(invitation)
  })

  return (
    <Show when={getInvitation()} fallback={<OrgInvitationLoading />}>
      <OrgInvitationForm mode={p.mode} sm={sm} />
    </Show>
  )
}

function OrgInvitationLoading() {
  return <LoadingSection loadingSubject={ttc("Organization Invitation")} />
}
