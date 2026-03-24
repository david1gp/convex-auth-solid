import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.jsx"
import { NavResource } from "#src/app/nav/NavResource.jsx"
import { ResourceFileListLoader } from "#src/file/ui/list/ResourceFileListLoader.jsx"
import { ResourceFileAdd } from "#src/file/ui/mutate/ResourceFileAdd.jsx"
import { urlFileUpload } from "#src/file/url/urlFile.js"
import { PageHeader } from "#src/ui/header/PageHeader.jsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.jsx"
import { formMode } from "#ui/input/form/formMode.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"

export function ResourceFileAddPage() {
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
              <NavLinkButton href={urlFileUpload(getResourceId()!)} isActive={true}>
                {getPageTitle()}
              </NavLinkButton>
            </NavResource>
            <PageHeader title={ttc("Manage Files")} class="mb-4" />
            <ResourceFileListLoader mode={formMode.add} resourceId={getResourceId()!} />
            <ResourceFileAdd resourceId={getResourceId()!} />
          </PageWrapper>
        )}
      </Match>
    </Switch>
  )
}

function getPageTitle(resourceName?: string) {
  return ttc("Files")
}
