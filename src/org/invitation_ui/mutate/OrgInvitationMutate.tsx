import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.js"
import type { DocOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.js"
import { OrgInvitationForm } from "#src/org/invitation_ui/form/OrgInvitationForm.jsx"
import { orgInvitationFormStateManagement } from "#src/org/invitation_ui/form/orgInvitationFormStateManagement.js"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.js"
import type { HasOrgInvitationCode } from "#src/org/org_model_field/HasOrgInvitationCode.js"
import { LoadingSection } from "#src/ui/pages/LoadingSection.jsx"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
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
