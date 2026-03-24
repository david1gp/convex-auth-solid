import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { NavOrg } from "#src/app/nav/NavOrg.js"
import { OrgMutate } from "#src/org/org_ui/mutate/OrgMutate.js"
import { urlOrgEdit } from "#src/org/org_url/urlOrg.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { useParams } from "@solidjs/router.js"
import { Match, Switch } from "solid-js"

const mode = formMode.edit

export function OrgEditPage() {
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
              <NavLinkButton href={urlOrgEdit(getOrgHandle())} isActive={true}>
                {ttc("Edit")}
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
