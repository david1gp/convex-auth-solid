import { NavAuth } from "@/auth/ui/nav/NavAuth"
import { orgListFindNameByHandle } from "@/org/ui/list/orgListSignal"
import { urlOrgList, urlOrgView } from "@/org/url/urlOrg"
import { workspaceListFindNameByHandle } from "@/workspace/ui/list/workspaceListSignal"
import { urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavAppDirProps extends MayHaveChildren, MayHaveClass {
  orgHandle?: string
  workspaceHandle?: string
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
              p.orgHandle && orgListFindNameByHandle(p.orgHandle),
              p.workspaceHandle && workspaceListFindNameByHandle(p.workspaceHandle),
            )}
          />
        )}
      </Show>
      <Show when={p.orgHandle && orgListFindNameByHandle(p.orgHandle)}>
        {(orgName) => (
          <>
            <div class="text-muted-foreground py-3 select-none">/</div>
            <LinkButton variant={buttonVariant.link} href={p.orgHandle ? urlOrgView(p.orgHandle) : ""}>
              {orgName()}
            </LinkButton>
          </>
        )}
      </Show>
      <Show when={p.workspaceHandle && workspaceListFindNameByHandle(p.workspaceHandle)}>
        {(workspaceName) => (
          <>
            <div class="text-muted-foreground py-3 select-none">/</div>
            <LinkButton variant={buttonVariant.link} href={p.workspaceHandle ? urlWorkspaceView(p.workspaceHandle) : ""}>
              {workspaceName()}
            </LinkButton>
          </>
        )}
      </Show>
    </>
  )
}
