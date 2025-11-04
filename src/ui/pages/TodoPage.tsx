import { OrganizationListLinkButton } from "@/app/nav/links/OrganizationListLinkButton"
import { WorkspaceListLinkButton } from "@/app/nav/links/WorkspaceListLinkButton"
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
            <OrganizationListLinkButton />
            <WorkspaceListLinkButton />
          </>
        }
      />
      <TodoSection {...p} />
    </PageWrapper>
  )
}
