import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { NavResource } from "#src/app/nav/NavResource.js"
import { ResourceMutate } from "#src/resource/ui/mutate/ResourceMutate.js"
import { urlResourceEdit } from "#src/resource/url/urlResource.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { useParams } from "@solidjs/router.js"
import { Match, Switch } from "solid-js"

const mode = formMode.edit

export function ResourceEditPage() {
  const params = useParams()
  const getResourceIdParam = () => params.resourceId
  return (
    <Switch>
      <Match when={!getResourceIdParam()}>
        <ErrorPage title={ttc("Missing :resourceId in path")} />
      </Match>
      <Match when={getResourceIdParam()}>
        {(getResourceId) => (
          <PageWrapper>
            <NavResource getResourcePageTitle={getPageTitle} resourceId={getResourceId()}>
              <NavLinkButton href={urlResourceEdit(getResourceId())} isActive={true}>
                {ttc("Edit")}
              </NavLinkButton>
            </NavResource>
            <ResourceMutate mode={mode} resourceId={getResourceId()} />
          </PageWrapper>
        )}
      </Match>
    </Switch>
  )
}

function getPageTitle(resourceName?: string) {
  return getFormModeTitle(mode, resourceName ?? ttc("Resource"))
}
