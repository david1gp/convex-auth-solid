import { isProdEnv } from "@/utils/env/isProdEnv"
import { mdiAlphaDCircleOutline } from "@mdi/js"
import { pathDemos } from "~ui/demo_pages/pathDemos"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButtonIconOnly } from "~ui/interactive/link/LinkButtonIconOnly"

export function DemosLinkButton() {
  if (isProdEnv()) return null
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
