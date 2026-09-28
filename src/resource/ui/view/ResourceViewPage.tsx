import { Match, Switch } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavResource } from "#src/app/nav/NavResource.tsx"
import { ResourceFileListLoader } from "#src/file/ui/list/ResourceFileListLoader.tsx"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import { ResourceLoader } from "#src/resource/ui/view/ResourceLoader.tsx"
import { ResourceViewDetailed } from "#src/resource/ui/view/ResourceViewDetailed.tsx"
import { resourceViewPageStateCreate } from "#src/resource/ui/view/resourceViewPageStateCreate.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { formMode } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function ResourceViewPage(p: {
  demo?: { resourceId: string; resource: () => ResourceModel | undefined; editHref: string }
}) {
  const state = resourceViewPageStateCreate(() => p.demo?.resourceId)
  return (
    <Switch>
      <Match when={!state.resourceId()}>
        <ErrorPage title={ttc("Missing :resourceId in path")} />
      </Match>
      <Match when={state.resourceId()}>
        {(getResourceId) => (
          <PageWrapper>
            {!p.demo && <NavResource getResourcePageTitle={getPageTitle} resourceId={getResourceId()} />}
            {p.demo ? (
              <Switch>
                <Match when={p.demo.resource()}>
                  {(resource) => <ResourceViewDetailed resource={resource()} editHref={p.demo!.editHref} />}
                </Match>
                <Match when={!p.demo.resource()}>
                  <ErrorPage title={ttc("Resource not found")} />
                </Match>
              </Switch>
            ) : (
              <>
                <ResourceLoader resourceId={getResourceId()} ResourceComponent={ResourceViewDetailed} />
                <ResourceFileListLoader mode={formMode.view} resourceId={getResourceId()} />
              </>
            )}
          </PageWrapper>
        )}
      </Match>
    </Switch>
  )
}

function getPageTitle(resourceName?: string) {
  return resourceName ?? ttc("View Resource")
}
