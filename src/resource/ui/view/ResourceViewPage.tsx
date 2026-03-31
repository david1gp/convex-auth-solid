import { ttc } from "#src/app/i18n/ttc.ts"
import { NavResource } from "#src/app/nav/NavResource.tsx"
import { ResourceFileListLoader } from "#src/file/ui/list/ResourceFileListLoader.tsx"
import { ResourceLoader } from "#src/resource/ui/view/ResourceLoader.tsx"
import { ResourceViewDetailed } from "#src/resource/ui/view/ResourceViewDetailed.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { formMode } from "#ui/input/form/formMode.ts"
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
