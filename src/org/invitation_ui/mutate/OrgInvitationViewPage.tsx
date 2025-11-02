import { NavOrg } from "@/app/nav/NavOrg"
import { OrgInvitationMutate } from "@/org/invitation_ui/mutate/OrgInvitationMutate"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, getFormTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"

const mode = formMode.remove

export function OrgInvitationViewPage() {
  const params = useParams()
  const getOrgHandle = () => params.orgHandle
  const getInvitationCode = () => params.invitationCode
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :orgHandle in path")} />
      </Match>
      <Match when={!getInvitationCode()}>
        <ErrorPage title={ttt("Missing :invitationCode in path")} />
      </Match>
      <Match when={getInvitationCode()}>
        <PageWrapper>
          <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}>
            <LinkLikeText>{ttt("Invitation")}</LinkLikeText>
          </NavOrg>
          <OrgInvitationMutate mode={mode} orgHandle={getOrgHandle()!} invitationCode={getInvitationCode()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormTitle(mode, ttt("Organization Invitation"))
}
