import { ttc } from "@/app/i18n/ttc"
import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavOrg } from "@/app/nav/NavOrg"
import { OrgInvitationForm } from "@/org/invitation_ui/form/OrgInvitationForm"
import { orgInvitationFormStateManagement } from "@/org/invitation_ui/form/orgInvitationFormStateManagement"
import { urlOrgInvitationAdd } from "@/org/invitation_url/urlOrgInvitation"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { formMode } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function OrgInvitationAddPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttc("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandle()}>{(getHandle) => <AddPage orgHandle={getHandle()} />}</Match>
    </Switch>
  )
}

interface AddPageProps extends HasOrgHandle, MayHaveClass {}

function AddPage(p: AddPageProps) {
  return (
    <LayoutWrapperApp>
      <PageWrapper>
        <NavOrg getOrgPageTitle={inviteToText} orgHandle={p.orgHandle}>
          <NavLinkButton href={urlOrgInvitationAdd(p.orgHandle)} isActive={true}>
            {ttc("Invite Member")}
          </NavLinkButton>
        </NavOrg>
        <OrgInvitationAdd orgHandle={p.orgHandle} />
      </PageWrapper>
    </LayoutWrapperApp>
  )
}

function inviteToText(orgName?: string) {
  const subject = orgName ?? ttc("Organization")
  return ttc("Invite to") + " " + subject
}

export interface OrgInvitationAddProps extends HasOrgHandle, MayHaveClass {}

export function OrgInvitationAdd(p: OrgInvitationAddProps) {
  const sm = orgInvitationFormStateManagement(formMode.add, p.orgHandle)
  return <OrgInvitationForm title={inviteToText(getOrgName(p.orgHandle))} mode={formMode.add} sm={sm} class={p.class} />
}

function getOrgName(orgHandle: string) {
  return orgHandle
}
