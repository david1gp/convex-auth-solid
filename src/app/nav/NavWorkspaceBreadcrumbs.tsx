import { WorkspacesLinkButton } from "@/ui/links/WorkspacesLinkButton"
import { workspaceListFindNameByHandle } from "@/workspace/ui/list/workspaceListSignal"
import { urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { Show } from "solid-js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import { NavBreadcrumbSeparator } from "./NavBreadcrumbSeparator"

export interface NavWorkspaceBreadcrumbsProps extends MayHaveChildren {
  workspaceHandle?: string
  getWorkspaceName?: (workspaceHandle: string) => string
  getWorkspacePageTitle?: (workspaceName?: string) => string
}

export function NavWorkspaceBreadcrumbs(p: NavWorkspaceBreadcrumbsProps) {
  function getWorkspaceName(handle: string) {
    if (p.getWorkspaceName) return p.getWorkspaceName(handle)
    return workspaceListFindNameByHandle(handle)
  }
  return (
    <>
      <NavBreadcrumbSeparator />
      <WorkspacesLinkButton />
      <Show when={p.getWorkspacePageTitle}>
        {(getPageTitle) => (
          <SetPageTitle title={getPageTitle()(p.workspaceHandle && getWorkspaceName(p.workspaceHandle))} />
        )}
      </Show>
      <Show when={p.workspaceHandle && p.workspaceHandle && getWorkspaceName(p.workspaceHandle)}>
        {(workspaceName) => (
          <>
            <NavBreadcrumbSeparator />
            <LinkButton
              variant={buttonVariant.link}
              href={p.workspaceHandle ? urlWorkspaceView(p.workspaceHandle) : ""}
            >
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
