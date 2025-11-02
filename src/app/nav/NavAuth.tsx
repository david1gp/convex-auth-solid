import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import { splitProps } from "solid-js"
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
          <LinkLikeText>{s.title}</LinkLikeText>
        </>
      }
      childrenRight={s.children}
      {...rest}
    />
  )
}
