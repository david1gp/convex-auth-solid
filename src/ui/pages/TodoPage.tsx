import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.js"
import { NavCenter } from "#src/app/nav/NavCenter.js"
import { NavStatic } from "#src/app/nav/NavStatic.js"
import { urlTodo } from "#src/app/pages/urlTodo.js"
import { TodoSection, type TodoSectionProps } from "#src/ui/pages/TodoSection.js"
import { PageWrapper } from "#ui/static/page/PageWrapper"

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
