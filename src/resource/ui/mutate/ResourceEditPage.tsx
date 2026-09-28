import { useParams } from "@tanstack/solid-router"
import { Match, Switch } from "solid-js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavResource } from "#src/app/nav/NavResource.tsx"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import type { ResourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.ts"
import { ResourceMutate } from "#src/resource/ui/mutate/ResourceMutate.tsx"
import { urlResourceEdit } from "#src/resource/url/urlResource.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

const mode = formMode.edit

export function ResourceEditPage(p: {
  demo?: { resourceId: string; resource: ResourceModel; form: ResourceFormStateManagement; removeHref: string }
}) {
  const params = useParams({ strict: false })
  const getResourceIdParam = () => p.demo?.resourceId ?? params().resourceId
  return (
    <Switch>
      <Match when={!getResourceIdParam()}>
        <ErrorPage title={ttc("Missing :resourceId in path")} />
      </Match>
      <Match when={getResourceIdParam()}>
        {(getResourceId) => (
          <PageWrapper>
            {!p.demo && (
              <NavResource getResourcePageTitle={getPageTitle} resourceId={getResourceId()}>
                <NavLinkButton href={urlResourceEdit(getResourceId())} isActive={true}>
                  {ttc("Edit")}
                </NavLinkButton>
              </NavResource>
            )}
            {p.demo ? (
              <ResourceMutate
                mode={mode}
                resourceId={getResourceId()}
                demo={{ resource: p.demo.resource, form: p.demo.form, removeHref: p.demo.removeHref }}
              />
            ) : (
              <ResourceMutate mode={mode} resourceId={getResourceId()} />
            )}
          </PageWrapper>
        )}
      </Match>
    </Switch>
  )
}

function getPageTitle(resourceName?: string) {
  return getFormModeTitle(mode, resourceName ?? ttc("Resource"))
}
