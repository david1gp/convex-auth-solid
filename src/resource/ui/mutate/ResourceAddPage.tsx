import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.jsx"
import { NavResource } from "#src/app/nav/NavResource.jsx"
import { ResourceForm } from "#src/resource/ui/form/ResourceForm.jsx"
import { resourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.js"
import { urlResourceAdd } from "#src/resource/url/urlResource.js"
import { formMode } from "#ui/input/form/formMode.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function ResourceAddPage() {
  return (
    <PageWrapper>
      <NavResource getResourcePageTitle={getPageTitle}>
        <NavLinkButton href={urlResourceAdd()} isActive={true}>
          {ttc("Create")}
        </NavLinkButton>
      </NavResource>
      <ResourceAddLoader />
    </PageWrapper>
  )
}

function getPageTitle() {
  return ttc("Create new Resource")
}

import type { OrgModel } from "#src/org/org_model/OrgModel.js"
import { createQueryOrgList } from "#src/resource/ui/org/createQueryOrgList.jsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.jsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.jsx"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.js"
import { resultHasList } from "#src/utils/result/resultHasList.js"
import { Match, Switch } from "solid-js"

export function ResourceAddLoader() {
  const getOrgOptionsResult = createQueryOrgList()
  return (
    <Switch>
      <Match when={!getOrgOptionsResult()}>
        <LoadingSection loadingSubject={ttc("Resource")} />
      </Match>
      <Match when={resultHasErrorMessage(getOrgOptionsResult())}>
        {(getErrorMessage) => <ErrorPage title={getErrorMessage()} />}
      </Match>
      <Match when={resultHasList(getOrgOptionsResult())}>
        {(getOptions) => <ResourceAdd orgOptions={getOptions()} />}
      </Match>
    </Switch>
  )
}

export interface ResourceAddProps {
  orgOptions: OrgModel[]
}

export function ResourceAdd(p: ResourceAddProps) {
  const sm = resourceFormStateManagement(formMode.add)
  return <ResourceForm mode={formMode.add} sm={sm} />
}
