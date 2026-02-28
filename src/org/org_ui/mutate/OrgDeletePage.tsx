import { ttc } from "@/app/i18n/ttc"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavOrg } from "@/app/nav/NavOrg"
import { OrgMutate } from "@/org/org_ui/mutate/OrgMutate"
import { urlOrgRemove } from "@/org/org_url/urlOrg"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { formMode, getFormModeTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"

const mode = formMode.remove

export function OrgDeletePage() {
  const params = useParams()
  const getOrgHandleParam = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandleParam()}>
        <ErrorPage title={ttc("Missing :orgHandle in path")} />
      </Match>
      <Match when={getOrgHandleParam()}>
        {(getOrgHandle) => (
          <PageWrapper>
            <NavOrg getOrgPageTitle={getPageTitle} orgHandle={getOrgHandle()}>
              <NavLinkButton href={urlOrgRemove(getOrgHandle())} isActive={true}>
                {ttc("Delete")}
              </NavLinkButton>
            </NavOrg>
            <OrgMutate mode={mode} orgHandle={getOrgHandle()} />
          </PageWrapper>
        )}
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormModeTitle(mode, workspaceName ?? ttc("Organization"))
}
