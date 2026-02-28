import { ttc } from "@/app/i18n/ttc"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { OrgInvitationForm } from "@/org/invitation_ui/form/OrgInvitationForm"
import { orgInvitationFormStateManagement } from "@/org/invitation_ui/form/orgInvitationFormStateManagement"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import type { HasOrgInvitationCode } from "@/org/org_model_field/HasOrgInvitationCode"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQuery } from "@/utils/convex_client/createQuery"
import { api } from "@convex/_generated/api"
import { Show, createEffect } from "solid-js"
import type { HasFormModeMutate } from "~ui/input/form/formModeMutate"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
