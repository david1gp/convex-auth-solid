import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.jsx"
import { NavOrg } from "#src/app/nav/NavOrg.jsx"
import { OrgMutate } from "#src/org/org_ui/mutate/OrgMutate.jsx"
import { urlOrgRemove } from "#src/org/org_url/urlOrg.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.jsx"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"

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
