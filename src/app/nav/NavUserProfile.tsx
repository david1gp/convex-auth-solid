import { OrganizationListNavButton } from "@/app/nav/links/OrganizationListNavButton"
import { ResourceListNavButton } from "@/app/nav/links/ResourceListNavButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { NavStatic } from "@/app/nav/NavStatic"
import { splitProps, type JSX } from "solid-js"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavUserProfileProps extends MayHaveClass {
  childrenLeft: JSX.Element
  children?: JSX.Element
  childrenRight?: JSX.Element
}

export function NavUserProfile(p: NavUserProfileProps) {
  const [s, rest] = splitProps(p, ["childrenLeft", "children", "childrenRight"])
  return (
    <NavStatic
      dense={true}
      childrenLeft={s.childrenLeft}
      childrenCenter={
        <>
          <OrganizationListNavButton />
          <WorkspaceListLinkNavButton />
          <ResourceListNavButton />
        </>
      }
      childrenRight={s.children ?? s.childrenRight}
      {...rest}
    />
  )
}
