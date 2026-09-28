import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import { OverviewPage } from "#src/app/pages/OverviewPage.tsx"
import { TodoPage } from "#src/ui/pages/TodoPage.tsx"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.tsx"

function OverviewPageDemo() {
  return (
    <>
      <OverviewPage demo />
      <nav aria-label="App page demos" class="flex gap-4">
        <LinkButtonInternal to={pageDemoHref("/")}>Overview demo</LinkButtonInternal>
        <LinkButtonInternal to={pageDemoHref("/todo")}>To do demo</LinkButtonInternal>
      </nav>
    </>
  )
}

function TodoPageDemo() {
  return (
    <>
      <TodoPage demo title="To do" />
      <nav aria-label="App page demos" class="flex gap-4">
        <LinkButtonInternal to={pageDemoHref("/")}>Overview demo</LinkButtonInternal>
        <LinkButtonInternal to={pageDemoHref("/overview")}>Overview alias demo</LinkButtonInternal>
        <LinkButtonInternal to={pageDemoHref("/todo")}>To do demo</LinkButtonInternal>
      </nav>
    </>
  )
}

/** Actual app page views, explicitly selected for the three app-core page routes. */
export const appPageDemoRendererMap = {
  "/": OverviewPageDemo,
  "/overview": OverviewPageDemo,
  "/todo": TodoPageDemo,
} as const
