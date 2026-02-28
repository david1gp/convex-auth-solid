import { ttc } from "@/app/i18n/ttc"
import { NavResource } from "@/app/nav/NavResource"
import { ResourceFileListLoader } from "@/file/ui/list/ResourceFileListLoader"
import { ResourceLoader } from "@/resource/ui/view/ResourceLoader"
import { ResourceViewDetailed } from "@/resource/ui/view/ResourceViewDetailed"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { formMode } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"

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
