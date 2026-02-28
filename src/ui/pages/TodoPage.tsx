import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { OrganizationListNavButton } from "@/app/nav/links/OrganizationListNavButton"
import { ResourceListNavButton } from "@/app/nav/links/ResourceListNavButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import { urlTodo } from "@/app/pages/urlTodo"
import { TodoSection, type TodoSectionProps } from "@/ui/pages/TodoSection"
import { PageWrapper } from "~ui/static/page/PageWrapper"

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
        childrenCenter={
          <>
            <OrganizationListNavButton />
            <WorkspaceListLinkNavButton />
            <ResourceListNavButton />
          </>
        }
      />
      <TodoSection {...p} />
    </PageWrapper>
  )
}
