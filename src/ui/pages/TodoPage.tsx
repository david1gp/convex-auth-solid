import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.jsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.jsx"
import { NavCenter } from "#src/app/nav/NavCenter.jsx"
import { NavStatic } from "#src/app/nav/NavStatic.jsx"
import { urlTodo } from "#src/app/pages/urlTodo.js"
import { TodoSection, type TodoSectionProps } from "#src/ui/pages/TodoSection.jsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function TodoPage(p: TodoSectionProps) {
  return (
    <PageWrapper>
      <NavStatic
        dense={false}
        childrenLeft={
          p.title && (
            <>
              <NavBreadcrumbSeparator />
              <NavLinkButton href={urlTodo()} isActive={true}>
                {p.title}
              </NavLinkButton>
            </>
          )
        }
        childrenCenter={<NavCenter hasBreadcrumbs={false} />}
      />
      <TodoSection {...p} />
    </PageWrapper>
  )
}
