import { NavStatic } from "@/app/nav/NavStatic"
import type { ComponentProps } from "solid-js"
import { Show, splitProps } from "solid-js"
import type { DemoNavDataProps } from "~ui/demo_pages/DemoNavDataProps"
import { LinkBlock } from "~ui/demo_pages/LinkBlock"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { CorvuPopover } from "~ui/interactive/popover/CorvuPopover"
import { objectEntries } from "~utils/obj/objectEntries"
import { objectKeys } from "~utils/obj/objectKeys"

export interface DemoNavProps extends DemoNavDataProps, ComponentProps<"nav"> {}

export function NavDemo(p: DemoNavProps) {
  const [s, rest] = splitProps(p, ["children", "category", "compName", "demoList", "demoPrefix", "class"])
  return (
    <NavStatic
      dense={!!(p.category || p.compName)}
      class="max-w-4xl"
      {...rest}
      childrenLeft={<ChildrenLeft {...s} />}
    />
  )
}

function ChildrenLeft(p: DemoNavDataProps) {
  return (
    <>
      <Show when={p.category}>
        <ChildrenLeftCategory {...p} />
      </Show>
      <Show when={p.category && p.compName}>
        <ChildrenLeftComp {...p} />
      </Show>
    </>
  )
}

function ChildrenLeftCategory(s: DemoNavDataProps) {
  return (
    <>
      <NavSeparatingSlash />
      <LinkButton variant={buttonVariant.ghost} href={`${s.demoPrefix}/${s.category}/`} class="text-lg font-medium">
        {s.category}
      </LinkButton>
    </>
  )
}

function ChildrenLeftComp(s: DemoNavDataProps) {
  return (
    <>
      <NavSeparatingSlash />
      <ComponentPopover demoList={s.demoList} category={s.category} compName={s.compName} demoPrefix={s.demoPrefix} />
    </>
  )
}

function ComponentPopover(
  s: Pick<DemoNavProps, "class" | "children" | "category" | "compName" | "demoList" | "demoPrefix">,
) {
  if (!s.category || !s.compName) return null
  const links = objectEntries(s.demoList)
    .filter(([category, tree]) => category === s.category)
    .flatMap(([category, tree]) => objectKeys(tree).map((compName) => `${s.demoPrefix}/${category}/${compName}`))
  if (!links || links.length <= 0) return null
  return (
    <CorvuPopover variant={buttonVariant.ghost} buttonChildren={s.compName} class="text-lg font-medium">
      <LinkBlock header={s.category} removeUrlPrefix={`${s.demoPrefix}/${s.category}/`} links={links} />
    </CorvuPopover>
  )
}

function NavSeparatingSlash() {
  return <span class={"py-1.5 text-gray-500 text-lg font-medium select-none"}>/</span>
}
