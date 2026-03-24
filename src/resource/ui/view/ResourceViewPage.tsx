import { ttc } from "#src/app/i18n/ttc.js"
import { NavResource } from "#src/app/nav/NavResource.jsx"
import { ResourceFileListLoader } from "#src/file/ui/list/ResourceFileListLoader.jsx"
import { ResourceLoader } from "#src/resource/ui/view/ResourceLoader.jsx"
import { ResourceViewDetailed } from "#src/resource/ui/view/ResourceViewDetailed.jsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.jsx"
import { formMode } from "#ui/input/form/formMode.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"

export function ResourceViewPage() {
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
            <NavResource getResourcePageTitle={getPageTitle} resourceId={getResourceId()}></NavResource>
            <ResourceLoader resourceId={getResourceId()} ResourceComponent={ResourceViewDetailed} />
            <ResourceFileListLoader mode={formMode.view} resourceId={getResourceId()} />
          </PageWrapper>
        )}
      </Match>
    </Switch>
  )
}

function getPageTitle(resourceName?: string) {
  return resourceName ?? ttc("View Resource")
}
