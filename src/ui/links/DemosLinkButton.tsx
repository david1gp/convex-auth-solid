import { isProdEnvVite } from "#src/utils/ui/isProdEnvVite.ts"
import { pathDemos } from "#ui/demo_pages/pathDemos.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonIconOnly } from "#ui/interactive/link/LinkButtonIconOnly.jsx"
import { mdiAlphaDCircleOutline } from "@mdi/js"

export function DemosLinkButton() {
  if (isProdEnvVite()) return null
  return (
    <LinkButtonIconOnly
      href={pathDemos}
      title="Demos"
      variant={buttonVariant.ghost}
      icon={mdiAlphaDCircleOutline}
      iconClass="size-7"
    ></LinkButtonIconOnly>
  )
}
