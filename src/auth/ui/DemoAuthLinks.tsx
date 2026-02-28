import { ttc } from "@/app/i18n/ttc"
import { AuthLinks } from "@/auth/ui/AuthLinks"
import { PageWrapper } from "~ui/static/page/PageWrapper"

export function DemoAuthLinks() {
  return (
    <PageWrapper>
      <section>
        <h2 class="text-lg font-semibold mb-2">{ttc("Demo Auth Links")}</h2>
        <AuthLinks />
      </section>
    </PageWrapper>
  )
}
