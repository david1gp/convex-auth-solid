import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.jsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.jsx"
import { NavCenter } from "#src/app/nav/NavCenter.jsx"
import { NavStatic } from "#src/app/nav/NavStatic.jsx"
import { urlOverview } from "#src/app/pages/urlOverview.js"
import { AuthLinks } from "#src/auth/ui/AuthLinks.jsx"
import { PageHeader } from "#src/ui/header/PageHeader.jsx"
import { ttt } from "#ui/i18n/ttt.js"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

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
        childrenCenter={<NavCenter />}
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
