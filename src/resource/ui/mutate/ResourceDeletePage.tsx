import { ttc } from "@/app/i18n/ttc"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavResource } from "@/app/nav/NavResource"
import { ResourceMutate } from "@/resource/ui/mutate/ResourceMutate"
import { urlResourceRemove } from "@/resource/url/urlResource"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { formMode, getFormModeTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"

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
