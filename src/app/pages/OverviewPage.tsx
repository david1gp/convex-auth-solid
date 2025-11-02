import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import { AuthLinks } from "@/auth/ui/AuthLinks"
import { PageHeader } from "@/ui/header/PageHeader"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import { OrganizationsLinkButton } from "@/ui/links/OrganizationsLinkButton"
import { WorkspacesLinkButton } from "@/ui/links/WorkspacesLinkButton"
import { ttt } from "~ui/i18n/ttt"
import { PageWrapper } from "~ui/static/page/PageWrapper"

export function OverviewPage() {
  const title = ttt("Overview")
  return (
    <PageWrapper>
      <NavStatic
        dense={false}
        childrenLeft={
          <>
            <NavBreadcrumbSeparator />
            <LinkLikeText>{title}</LinkLikeText>
          </>
        }
        childrenCenter={
          <>
            <OrganizationsLinkButton />
            <WorkspacesLinkButton />
          </>
        }
      />
      <PageHeader title={title} subtitle={ttt("This is a private page seen only to logged in users")} class="py-20" />
      <section>
        <h2 class="text-lg font-semibold mb-2">{ttt("Demo Auth Links")}</h2>
        <AuthLinks />
      </section>
    </PageWrapper>
  )
}
