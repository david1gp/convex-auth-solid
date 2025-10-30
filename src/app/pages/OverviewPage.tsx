import { DemoAuthLinks } from "@/app/getRoutesApp"
import { NavAppDir } from "@/app/nav/NavAppDir"
import { urlOrgList } from "@/org/org_url/urlOrg"
import { PageHeader } from "@/ui/header/PageHeader"
import { urlWorkspaceList } from "@/workspace/url/urlWorkspace"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { PageWrapper2 } from "~ui/static/page/PageWrapper2"

export function OverviewPage() {
  return (
    <PageWrapper2>
      <NavAppDir />
      <PageHeader
        title={ttt("Overview")}
        subtitle={ttt("this is a private page seen only to logged in users")}
      ></PageHeader>

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
