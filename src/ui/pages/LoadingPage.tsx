import { LoadingSection, type LoadingSectionProps } from "#src/ui/pages/LoadingSection.tsx"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function LoadingPage(p: LoadingSectionProps) {
  return (
    <PageWrapper>
      <LoadingSection {...p} />
    </PageWrapper>
  )
}
