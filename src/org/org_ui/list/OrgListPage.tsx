import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavOrg } from "#src/app/nav/NavOrg.tsx"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import { OrgListView } from "#src/org/org_ui/list/OrgListView.tsx"
import { orgListPageStateCreate } from "#src/org/org_ui/list/orgListPageStateCreate.ts"
import { PaginationControls } from "#src/ui/pagination/PaginationControls.tsx"
import type { PaginationResultType } from "#src/utils/convex_backend/paginationResultType.ts"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function OrgListPage() {
  return (
    <PageWrapper>
      <NavOrg getOrgPageTitle={getPageTitle} />
      <OrgListLoader />
    </PageWrapper>
  )
}

function getPageTitle(_orgName?: string) {
  return ttc("Organizations")
}

type Org = OrgModel

function OrgListLoader() {
  const pagination = orgListPageStateCreate()
  return (
    <OrgListView
      orgs={getOrgsPage(pagination.page())?.page}
      error={resultHasErrorMessage(pagination.page())}
      pagination={
        <PaginationControls
          page={() => pagination.history().length + 1}
          canPrevious={pagination.canPrevious}
          canNext={pagination.canNext}
          previous={pagination.previous}
          next={pagination.next}
          loading={pagination.loading}
        />
      }
    />
  )
}

function getOrgsPage(orgsResult: Result<PaginationResultType<Org>> | undefined): PaginationResultType<Org> | null {
  if (!orgsResult?.success) return null
  return orgsResult.data
}
