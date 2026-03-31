import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavCenter } from "#src/app/nav/NavCenter.tsx"
import { NavStatic } from "#src/app/nav/NavStatic.tsx"
import { LinkLikeNavText } from "#src/app/nav/links/LinkLikeNavText.tsx"
import { userSessionGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
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
