import { createEffect, Match, Switch } from "solid-js"
import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { OrgInvitationForm } from "#src/org/invitation_ui/form/OrgInvitationForm.tsx"
import { orgInvitationFormStateManagement } from "#src/org/invitation_ui/form/orgInvitationFormStateManagement.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import type { HasOrgInvitationCode } from "#src/org/org_model_field/HasOrgInvitationCode.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { queryCreate } from "#src/utils/convex_client/queryCreate.ts"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

interface OrgInvitationMutateProps extends HasOrgHandle, HasOrgInvitationCode, HasFormModeMutate, MayHaveClass {}

export function OrgInvitationMutate(p: OrgInvitationMutateProps) {
  const op = "OrgInvitationMutate"
  const getInvitation = queryCreate(api.org.orgInvitationGetQuery, {
    orgHandle: p.orgHandle,
    invitationCode: p.invitationCode,
  })

  const sm = orgInvitationFormStateManagement(p.mode, p.orgHandle, p.invitationCode)

  const getInvitationData = () => {
    const result = getInvitation()
    if (!result?.success) {
      return null
    }
    return result.data
  }

  const getInvitationErrorMessage = () => {
    const result = getInvitation()
    if (!result || result.success) {
      return ""
    }
    return result.errorMessage
  }

  createEffect(() => {
    const invitation = getInvitationData()
    if (!invitation) {
      return
    }
    sm.loadData(invitation)
  })

  return (
    <Switch>
      <Match when={!getInvitation()}>
        <OrgInvitationLoading />
      </Match>
      <Match when={getInvitationErrorMessage()}>{(errorMessage) => <ErrorPage title={errorMessage()} />}</Match>
      <Match when={getInvitationData()}>
        <OrgInvitationForm mode={p.mode} sm={sm} />
      </Match>
      <Match when={true}>
        <ErrorPage title={ttc("Invitation not found")} />
      </Match>
    </Switch>
  )
}

function OrgInvitationLoading() {
  return <LoadingSection loadingSubject={ttc("Organization Invitation")} />
}
