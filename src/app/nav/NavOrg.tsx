import { NavOrgBreadcrumbs, type NavOrgBreadcrumbsProps } from "@/app/nav/NavOrgBreadcrumbs"
import { NavStatic } from "@/app/nav/NavStatic"
import { WorkspaceListLinkButton } from "@/app/nav/links/WorkspaceListLinkButton"
import { splitProps } from "solid-js"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavAppDirProps extends NavOrgBreadcrumbsProps, MayHaveChildren, MayHaveClass {
  // orgChildren?: JSXElement
}

export function NavOrg(p: NavAppDirProps) {
  const [s, rest] = splitProps(p, ["children", "class"])
  return (
    <NavStatic
      dense={true}
      class={p.class}
      childrenLeft={<NavOrgBreadcrumbs {...rest}>{s.children}</NavOrgBreadcrumbs>}
      childrenCenter={<WorkspaceListLinkButton />}
    />
  )
}
