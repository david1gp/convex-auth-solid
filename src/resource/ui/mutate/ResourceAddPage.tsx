import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavResource } from "#src/app/nav/NavResource.tsx"
import { ResourceForm } from "#src/resource/ui/form/ResourceForm.tsx"
import { resourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.ts"
import { urlResourceAdd } from "#src/resource/url/urlResource.ts"
import { formMode } from "#ui/input/form/formMode.ts"
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

import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import { createQueryOrgList } from "#src/resource/ui/org/createQueryOrgList.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import { resultHasList } from "#src/utils/result/resultHasList.ts"
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
