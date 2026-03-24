import { ttc } from "#src/app/i18n/ttc.js"
import { NavResource } from "#src/app/nav/NavResource.js"
import { ResourceFileListLoader } from "#src/file/ui/list/ResourceFileListLoader.js"
import { ResourceLoader } from "#src/resource/ui/view/ResourceLoader.js"
import { ResourceViewDetailed } from "#src/resource/ui/view/ResourceViewDetailed.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { formMode } from "#ui/input/form/formMode"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { useParams } from "@solidjs/router.js"
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
