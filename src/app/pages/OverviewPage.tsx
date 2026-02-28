import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { OrganizationListNavButton } from "@/app/nav/links/OrganizationListNavButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import { urlOverview } from "@/app/pages/urlOverview"
import { AuthLinks } from "@/auth/ui/AuthLinks"
import { PageHeader } from "@/ui/header/PageHeader"
import { ttt } from "~ui/i18n/ttt"
import { PageWrapper } from "~ui/static/page/PageWrapper"

export function OverviewPage() {
  const getTitle = () => ttt("Overview")
  return (
    <PageWrapper>
      <NavStatic
        dense={true}
        childrenLeft={
          <>
            <NavBreadcrumbSeparator />
            <NavLinkButton href={urlOverview()} isActive={true}>
              {getTitle()}
            </NavLinkButton>
          </>
        }
        childrenCenter={
          <>
            <OrganizationListNavButton />
            <WorkspaceListLinkNavButton />
          </>
        }
      />
      <PageHeader
        title={getTitle()}
        subtitle={ttt("This is a private page seen only to logged in users")}
        class="py-20"
      />
      <section>
        <h2 class="text-lg font-semibold mb-2">{ttt("Demo Auth Links")}</h2>
        <AuthLinks />
      </section>
    </PageWrapper>
  )
}
