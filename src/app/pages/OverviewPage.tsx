import { DemoAuthLinks } from "@/app/getRoutesApp"
import { NavAuth } from "@/auth/ui/nav/NavAuth"
import { urlOrgList } from "@/org/org_url/urlOrg"
import { urlWorkspaceList } from "@/workspace/url/urlWorkspace"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper2 } from "~ui/static/page/PageWrapper2"

export function OverviewPage() {
  return (
    <PageWrapper2>
      <NavAuth />
      <div class="py-20">
        <h1 class="text-4xl font-bold">{ttt("Overview")}</h1>
        <p>{ttt("this is a private page seen only to logged in users")}</p>
      </div>

      <div>
        <LinkButton variant={buttonVariant.link} href={urlOrgList()}>
          {ttt("Organizations")}
        </LinkButton>
        <LinkButton variant={buttonVariant.link} href={urlWorkspaceList()}>
          {ttt("Workspaces")}
        </LinkButton>
      </div>

      <div>
        <h2>{ttt("auth links")}</h2>
        <DemoAuthLinks />
      </div>
    </PageWrapper2>
  )
}
