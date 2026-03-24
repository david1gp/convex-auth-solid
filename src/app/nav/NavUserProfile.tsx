import { NavCenter } from "#src/app/nav/NavCenter.jsx"
import { NavStatic } from "#src/app/nav/NavStatic.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { splitProps, type JSX } from "solid-js"

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
      childrenCenter={<NavCenter hasBreadcrumbs={false} />}
      childrenRight={s.children ?? s.childrenRight}
      {...rest}
    />
  )
}
