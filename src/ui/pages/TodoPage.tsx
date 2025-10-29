import { TodoSection, type TodoSectionProps } from "@/ui/pages/TodoSection"
import { PageWrapper } from "~ui/static/page/PageWrapper"

export function TodoPage(p: TodoSectionProps) {
  return (
    <PageWrapper>
      <TodoSection {...p} />
    </PageWrapper>
  )
}
