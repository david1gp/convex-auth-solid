import { LoadingSection, type LoadingSectionProps } from "#src/ui/pages/LoadingSection.jsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function LoadingPage(p: LoadingSectionProps) {
  return (
    <PageWrapper>
      <LoadingSection {...p} />
    </PageWrapper>
  )
}
