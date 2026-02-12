import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavOrg } from "@/app/nav/NavOrg"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { OrgInvitationForm } from "@/org/invitation_ui/form/OrgInvitationForm"
import {
  orgInvitationFormStateManagement,
  type OrgInvitationFormData,
} from "@/org/invitation_ui/form/orgInvitationFormStateManagement"
import { urlOrgInvitationAccept, urlOrgInvitationAdd } from "@/org/invitation_url/urlOrgInvitation"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { orgListFindNameByHandle } from "@/org/org_ui/list/orgListSignal"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { createMutation } from "@/utils/convex_client/createMutation"
import { navigateTo } from "@/utils/router/navigateTo"
import { api } from "@convex/_generated/api"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function OrgInvitationAddPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={inviteToText} orgHandle={getOrgHandle()}>
            <NavLinkButton href={urlOrgInvitationAdd(getOrgHandle()!)} isActive={true}>
              {ttt("Invite Member")}
            </NavLinkButton>
          </NavOrg>
          <OrgInvitationAdd orgHandle={getOrgHandle()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function inviteToText(orgName?: string) {
  const subject = orgName ?? ttt("Organization")
  return ttt("Invite to") + " " + subject
}

export interface OrgInvitationAddProps extends HasOrgHandle, MayHaveClass {}

export function OrgInvitationAdd(p: OrgInvitationAddProps) {
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
    const url = urlOrgInvitationAccept(p.orgHandle, data.invitationCode)
    navigateTo(url)
  }
  const sm = orgInvitationFormStateManagement({ add: addAction })
  return <OrgInvitationForm title={inviteToText(getOrgName(p.orgHandle))} mode={formMode.add} sm={sm} class={p.class} />
}

function getOrgName(orgHandle: string) {
  return orgListFindNameByHandle(orgHandle)
}
