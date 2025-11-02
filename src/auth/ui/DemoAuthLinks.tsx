import { AuthLinks } from "@/auth/ui/AuthLinks"
import { ttt } from "~ui/i18n/ttt"
import { PageWrapper } from "~ui/static/page/PageWrapper"

export function DemoAuthLinks() {
  return (
    <PageWrapper>
      <section>
        <h2 class="text-lg font-semibold mb-2">{ttt("Demo Auth Links")}</h2>
        <AuthLinks />
      </section>
    </PageWrapper>
  )
}
