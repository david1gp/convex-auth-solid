import { NavAuth } from "@/auth/ui/nav/NavAuth"
import { orgListFindNameBySlug } from "@/org/ui/list/orgListSignal"
import { urlOrgList, urlOrgView } from "@/org/url/urlOrg"
import { workspaceListFindNameBySlug } from "@/workspace/ui/list/workspaceListSignal"
import { urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavAppDirProps extends MayHaveChildren, MayHaveClass {
  orgSlug?: string
  workspaceSlug?: string
  getPageTitle?: (orgName?: string, workspaceName?: string) => string
}

export function NavAppDir(p: NavAppDirProps) {
  return (
    <NavAuth class={p.class}>
      <LinkButton variant={buttonVariant.link} href={urlOrgList()}>
        {ttt("Organizations")}
      </LinkButton>
      <NavAppBreadcrumbtsLoader {...p} />
    </NavAuth>
  )
}

function NavAppBreadcrumbtsLoader(p: NavAppDirProps) {
  return (
    <>
      <Show when={p.getPageTitle}>
        {(getPageTitle) => (
          <SetPageTitle
            title={getPageTitle()(
              p.orgSlug && orgListFindNameBySlug(p.orgSlug),
              p.workspaceSlug && workspaceListFindNameBySlug(p.workspaceSlug),
            )}
          />
        )}
      </Show>
      <Show when={p.orgSlug && orgListFindNameBySlug(p.orgSlug)}>
        {(orgName) => (
          <>
            <div class="text-muted-foreground py-3 select-none">/</div>
            <LinkButton variant={buttonVariant.link} href={p.orgSlug ? urlOrgView(p.orgSlug) : ""}>
              {orgName()}
            </LinkButton>
          </>
        )}
      </Show>
      <Show when={p.workspaceSlug && workspaceListFindNameBySlug(p.workspaceSlug)}>
        {(workspaceName) => (
          <>
            <div class="text-muted-foreground py-3 select-none">/</div>
            <LinkButton variant={buttonVariant.link} href={p.workspaceSlug ? urlWorkspaceView(p.workspaceSlug) : ""}>
              {workspaceName()}
            </LinkButton>
          </>
        )}
      </Show>
    </>
  )
}
