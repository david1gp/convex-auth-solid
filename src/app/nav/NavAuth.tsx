import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.js"
import { NavCenter } from "#src/app/nav/NavCenter.js"
import { NavStatic } from "#src/app/nav/NavStatic.js"
import { LinkLikeNavText } from "#src/app/nav/links/LinkLikeNavText.js"
import { userSessionGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import { Show, splitProps } from "solid-js"

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
          <NavCenter />
        </Show>
      }
      childrenRight={s.children}
      {...rest}
    />
  )
}
