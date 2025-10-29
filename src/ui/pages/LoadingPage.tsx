import { LoadingSection, type LoadingSectionProps } from "@/ui/pages/LoadingSection"
import { PageWrapper } from "~ui/static/page/PageWrapper"

export function LoadingPage(p: LoadingSectionProps) {
  return (
    <PageWrapper>
      <LoadingSection {...p} />
    </PageWrapper>
  )
}
