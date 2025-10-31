import { NavAppDir } from "@/app/nav/NavAppDir"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { OrgInvitationForm } from "@/org/invitation_ui/form/OrgInvitationForm"
import {
  orgInvitationFormStateManagement,
  type OrgInvitationFormData,
} from "@/org/invitation_ui/form/orgInvitationFormStateManagement"
import { urlOrgInvitationView } from "@/org/invitation_url/urlOrgInvitation"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import { createMutation } from "@/utils/convex/createMutation"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import { api } from "@convex/_generated/api"
import { useNavigate, useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function OrgInvitationAddPage() {
  const params = useParams()
  const getReturnPath = () => params.returnPath
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <PageWrapper>
          <NavAppDir getPageTitle={getPageTitle} />
          <OrgInvitationAdd orgHandle={getOrgHandle()!} returnPath={getReturnPath()} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return ttt("Add new Organization Invitation")
}

export interface OrgInvitationAddProps extends HasOrgHandle, MayHaveReturnPath, MayHaveClass {}

export function OrgInvitationAdd(p: OrgInvitationAddProps) {
  const navigator = useNavigate()
  const addMutation = createMutation(api.org.orgInvitationInitMutation)

  async function addAction(data: OrgInvitationFormData): Promise<void> {
    const invitationIdResult = await addMutation({
      // auth
      token: userTokenGet(),
      // ids
      orgHandle: p.orgHandle,
      invitedName: data.invitedName,
      invitedEmail: data.invitedEmail,
      // data
      role: data.role,
    })
    if (!invitationIdResult.success) {
      console.error(invitationIdResult)
      toastAdd({ title: invitationIdResult.errorMessage, variant: toastVariant.error })
      return
    }
    const url = p.returnPath ?? urlOrgInvitationView(p.orgHandle, data.invitationCode)
    navigator(url)
  }
  const sm = orgInvitationFormStateManagement({ add: addAction })
  return <OrgInvitationForm mode={formMode.add} sm={sm} class={p.class} />
}
