import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { NavCenter } from "@/app/nav/NavCenter"
import { NavStatic } from "@/app/nav/NavStatic"
import { workspaceNameGet } from "@/workspace/ui/workspaceNameRecordSignal"
import { urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { Show, splitProps } from "solid-js"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { NavBreadcrumbSeparator } from "./NavBreadcrumbSeparator"

export interface NavWorkspaceProps extends NavWorkspaceBreadcrumbsProps, MayHaveChildren, MayHaveClass {}

export function NavWorkspace(p: NavWorkspaceProps) {
  const [s, rest] = splitProps(p, ["children", "class"])
  return (
    <NavStatic
      dense={true}
      class={p.class}
      childrenLeft={<NavWorkspaceBreadcrumbs {...rest}>{s.children}</NavWorkspaceBreadcrumbs>}
      childrenCenter={
        <NavCenter>
          <NavWorkspaceBreadcrumbs {...rest}>{s.children}</NavWorkspaceBreadcrumbs>
        </NavCenter>
      }
    />
  )
}

export interface NavWorkspaceBreadcrumbsProps extends MayHaveChildren {
  workspaceHandle?: string
  getWorkspacePageTitle?: (workspaceName?: string) => string
}

export function NavWorkspaceBreadcrumbs(p: NavWorkspaceBreadcrumbsProps) {
  return (
    <>
      <Show when={p.getWorkspacePageTitle}>
        {(getPageTitle) => (
          <SetPageTitle title={getPageTitle()(p.workspaceHandle && workspaceNameGet(p.workspaceHandle))} />
        )}
      </Show>
      {/* 1 */}
      <WorkspaceListLinkNavButton />
      {/* 2 */}
      <Show when={p.workspaceHandle && p.workspaceHandle && workspaceNameGet(p.workspaceHandle)}>
        {(workspaceName) => (
          <>
            <NavBreadcrumbSeparator />
            <NavLinkButton href={p.workspaceHandle ? urlWorkspaceView(p.workspaceHandle) : ""} isActive={!p.children}>
              {workspaceName()}
            </NavLinkButton>
          </>
        )}
      </Show>
      {/* 3 */}
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
