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

import { Match, Switch } from "solid-js"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import { createQueryOrgList } from "#src/resource/ui/org/createQueryOrgList.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"

export function ResourceAddLoader() {
  const orgOptionsPagination = createQueryOrgList()
  return (
    <Switch>
      <Match when={!orgOptionsPagination.page()}>
        <LoadingSection loadingSubject={ttc("Resource")} />
      </Match>
      <Match when={resultHasErrorMessage(orgOptionsPagination.page())}>
        {(getErrorMessage) => <ErrorPage title={getErrorMessage()} />}
      </Match>
      <Match when={getOrgOptionsPage(orgOptionsPagination.page())}>
        {(getOptions) => (
          <>
            <ResourceAdd orgOptions={getOptions().page} />
            <PaginationControls
              page={() => orgOptionsPagination.history().length + 1}
              canPrevious={orgOptionsPagination.canPrevious}
              canNext={orgOptionsPagination.canNext}
              previous={orgOptionsPagination.previous}
              next={orgOptionsPagination.next}
              loading={orgOptionsPagination.loading}
            />
          </>
        )}
      </Match>
    </Switch>
  )
}

export interface ResourceAddProps {
  orgOptions: OrgModel[]
}

export function ResourceAdd(_p: ResourceAddProps) {
  const sm = resourceFormStateManagement(formMode.add)
  return <ResourceForm mode={formMode.add} sm={sm} />
}

function getOrgOptionsPage(result: ReturnType<ReturnType<typeof createQueryOrgList>["page"]>) {
  if (!result?.success) return null
  return result.data
}
