import { NavStatic } from "@/app/nav/NavStatic"
import { NavWorkspaceBreadcrumbs, type NavWorkspaceBreadcrumbsProps } from "@/app/nav/NavWorkspaceBreadcrumbs"
import { OrganizationListLinkButton } from "@/app/nav/links/OrganizationListLinkButton"
import { splitProps } from "solid-js"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavWorkspaceProps extends NavWorkspaceBreadcrumbsProps, MayHaveChildren, MayHaveClass {
  // workspaceChildren?: JSXElement
}

export function NavWorkspace(p: NavWorkspaceProps) {
  const [s, rest] = splitProps(p, ["children", "class"])
  return (
    <NavStatic
      dense={true}
      class={p.class}
      childrenLeft={<NavWorkspaceBreadcrumbs {...rest}>{s.children}</NavWorkspaceBreadcrumbs>}
      childrenCenter={<OrganizationListLinkButton />}
    />
  )
}
