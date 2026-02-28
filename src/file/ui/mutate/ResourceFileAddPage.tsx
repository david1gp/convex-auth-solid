import { ttc } from "@/app/i18n/ttc"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavResource } from "@/app/nav/NavResource"
import { ResourceFileListLoader } from "@/file/ui/list/ResourceFileListLoader"
import { ResourceFileAdd } from "@/file/ui/mutate/ResourceFileAdd"
import { urlFileUpload } from "@/file/url/urlFile"
import { PageHeader } from "@/ui/header/PageHeader"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { formMode } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"

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
