import { urlOrgView } from "@/org/org_url/urlOrg"
import { WorkspacesLinkButton } from "@/ui/links/WorkspacesLinkButton"
import { workspaceListFindNameByHandle } from "@/workspace/ui/list/workspaceListSignal"
import { Show, type Accessor } from "solid-js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import { NavBreadcrumbSeparator } from "./NavBreadcrumbSeparator"

export interface NavWorkspaceBreadcrumbsProps extends MayHaveChildren {
  workspaceHandle?: string
  getWorkspaceName?: Accessor<string>
  getWorkspacePageTitle?: (orgName?: string) => string
}

export function NavWorkspaceBreadcrumbs(p: NavWorkspaceBreadcrumbsProps) {
  return (
    <>
      <NavBreadcrumbSeparator />
      <WorkspacesLinkButton />
      <Show when={p.getWorkspacePageTitle}>
        {(getPageTitle) => (
          <SetPageTitle
            title={getPageTitle()(
              p.workspaceHandle &&
                (p.getWorkspaceName ? p.getWorkspaceName() : workspaceListFindNameByHandle(p.workspaceHandle)),
            )}
          />
        )}
      </Show>
      <Show
        when={
          p.workspaceHandle &&
          (p.getWorkspaceName ? p.getWorkspaceName() : workspaceListFindNameByHandle(p.workspaceHandle))
        }
      >
        {(workspaceName) => (
          <>
            <NavBreadcrumbSeparator />
            <LinkButton variant={buttonVariant.link} href={p.workspaceHandle ? urlOrgView(p.workspaceHandle) : ""}>
              {workspaceName()}
            </LinkButton>
          </>
        )}
      </Show>
      <Show when={p.children}>
        {(getChildren) => (
          <>
            <NavBreadcrumbSeparator />
            {getChildren()}
          </>
        )}
      </Show>
    </>
  )
}
