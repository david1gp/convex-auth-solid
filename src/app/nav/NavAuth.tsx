import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import { LinkLikeNavText } from "@/app/nav/links/LinkLikeNavText"
import { OrganizationListNavButton } from "@/app/nav/links/OrganizationListNavButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { userSessionGet } from "@/auth/ui/signals/userSessionSignal"
import { Show, splitProps } from "solid-js"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavAuthProps extends MayHaveChildren, MayHaveClass {
  title: string
}

export function NavAuth(p: NavAuthProps) {
  const [s, rest] = splitProps(p, ["title", "children"])
  return (
    <NavStatic
      dense={false}
      childrenLeft={
        <>
          <NavBreadcrumbSeparator />
          <LinkLikeNavText>{s.title}</LinkLikeNavText>
        </>
      }
      childrenCenter={
        <Show when={userSessionGet()}>
          <OrganizationListNavButton />
          <WorkspaceListLinkNavButton />
        </Show>
      }
      childrenRight={s.children}
      {...rest}
    />
  )
}
