import { LoadingSection, type LoadingSectionProps } from "#src/ui/pages/LoadingSection.js"
import { PageWrapper } from "#ui/static/page/PageWrapper"

export function LoadingPage(p: LoadingSectionProps) {
  return (
    <PageWrapper>
      <LoadingSection {...p} />
    </PageWrapper>
  )
}
