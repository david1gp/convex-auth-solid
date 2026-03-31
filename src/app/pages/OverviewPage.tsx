import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavCenter } from "#src/app/nav/NavCenter.tsx"
import { NavStatic } from "#src/app/nav/NavStatic.tsx"
import { urlOverview } from "#src/app/pages/urlOverview.ts"
import { AuthLinks } from "#src/auth/ui/AuthLinks.tsx"
import { PageHeader } from "#src/ui/header/PageHeader.tsx"
import { ttt } from "#ui/i18n/ttt.ts"
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
