import { ttc } from "@/app/i18n/ttc"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavResource } from "@/app/nav/NavResource"
import { ResourceForm } from "@/resource/ui/form/ResourceForm"
import { resourceFormStateManagement } from "@/resource/ui/form/resourceFormStateManagement"
import { urlResourceAdd } from "@/resource/url/urlResource"
import { formMode } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"

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

import type { OrgModel } from "@/org/org_model/OrgModel"
import { createQueryOrgList } from "@/resource/ui/org/createQueryOrgList"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { resultHasErrorMessage } from "@/utils/result/resultHasErrorMessage"
import { resultHasList } from "@/utils/result/resultHasList"
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
