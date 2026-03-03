import { NavChildrenCenter } from "@/app/nav/NavChildrenCenter"
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
      childrenCenter={<NavChildrenCenter hasBreadcrumbs={false} />}
      childrenRight={s.children ?? s.childrenRight}
      {...rest}
    />
  )
}
