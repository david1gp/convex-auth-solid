import { OrganizationListNavButton } from "@/app/nav/links/OrganizationListNavButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
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
              <LinkLikeText>{p.title}</LinkLikeText>
            </>
          )
        }
        childrenCenter={
          <>
            <OrganizationListNavButton />
            <WorkspaceListLinkNavButton />
          </>
        }
      />
      <TodoSection {...p} />
    </PageWrapper>
  )
}
