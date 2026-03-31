import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavCenter } from "#src/app/nav/NavCenter.tsx"
import { NavStatic } from "#src/app/nav/NavStatic.tsx"
import { urlTodo } from "#src/app/pages/urlTodo.ts"
import { TodoSection, type TodoSectionProps } from "#src/ui/pages/TodoSection.tsx"
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
