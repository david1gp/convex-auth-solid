import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.jsx"
import { NavResource } from "#src/app/nav/NavResource.jsx"
import { ResourceMutate } from "#src/resource/ui/mutate/ResourceMutate.jsx"
import { urlResourceRemove } from "#src/resource/url/urlResource.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.jsx"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"

const mode = formMode.remove

export function ResourceDeletePage() {
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
              <NavLinkButton href={urlResourceRemove(getResourceId())} isActive={true}>
                {ttc("Remove")}
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
