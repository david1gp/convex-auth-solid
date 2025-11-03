import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { OrgInvitationForm } from "@/org/invitation_ui/form/OrgInvitationForm"
import {
  orgInvitationFormStateManagement,
  type OrgInvitationFormActions,
} from "@/org/invitation_ui/form/orgInvitationFormStateManagement"
import { urlOrgInvitationList } from "@/org/invitation_url/urlOrgInvitation"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import type { HasOrgInvitationCode } from "@/org/org_model/HasOrgInvitationCode"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createAction } from "@/utils/convex/createAction"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { Show, createEffect } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
import type { HasFormModeMutate } from "~ui/input/form/formModeMutate"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface OrgInvitationMutateProps extends HasOrgHandle, HasOrgInvitationCode, HasFormModeMutate, MayHaveClass {}

export function OrgInvitationMutate(p: OrgInvitationMutateProps) {
  const op = "OrgInvitationMutate"
  const navigator = useNavigate()
  const getInvitation = createQuery(api.org.orgInvitationGetQuery, {
    orgHandle: p.orgHandle,
    invitationCode: p.invitationCode,
  }) as () => DocOrgInvitation | undefined

  const resendMutation = createAction(api.org.orgInvitationResendAction)

  async function resendAction() {
    const invitation = getInvitation()
    if (!invitation) {
      console.warn("no invitation")
      return
    }
    const result = await resendMutation({
      token: userTokenGet(),
      invitationCode: p.invitationCode,
    })
    if (!result.success) {
      console.error(result)
      toastAdd({ title: result.errorMessage, variant: toastVariant.error })
      return
    }
    const url = urlOrgInvitationList(p.orgHandle)
    navigator(url)
  }

  const actions: OrgInvitationFormActions = {}
  if (p.mode === formMode.remove) {
    actions.remove = resendAction
  }

  const sm = orgInvitationFormStateManagement(actions)

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
  return <LoadingSection loadingSubject={ttt("Organization Invitation")} />
}
