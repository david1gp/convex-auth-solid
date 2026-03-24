import { ttc } from "#src/app/i18n/ttc.js"
import { AuthLinks } from "#src/auth/ui/AuthLinks.js"
import { PageWrapper } from "#ui/static/page/PageWrapper"

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
