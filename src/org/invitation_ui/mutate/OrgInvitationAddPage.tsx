import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.tsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import { OrgInvitationForm } from "#src/org/invitation_ui/form/OrgInvitationForm.tsx"
import { orgInvitationFormStateManagement } from "#src/org/invitation_ui/form/orgInvitationFormStateManagement.ts"
import { urlOrgInvitationAdd } from "#src/org/invitation_url/urlOrgInvitation.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { formMode } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"

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
