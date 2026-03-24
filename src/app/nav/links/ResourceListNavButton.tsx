import { classesActiveLink } from "#src/app/nav/links/classesActiveLink.js"
import { appTab, appTabIcon } from "#src/app/tabs/appTab.js"
import { appTabGetText } from "#src/app/tabs/appTabGetText.js"
import { urlResourceList } from "#src/resource/url/urlResource.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

export interface ResourceListLinkButtonProps extends MayHaveClass {
  isActive?: boolean
}

export function ResourceListNavButton(p: ResourceListLinkButtonProps) {
  return (
    <LinkButton
      icon={appTabIcon[appTab.resource]}
      variant={buttonVariant.link}
      href={urlResourceList()}
      class={classArr("text-lg", p.isActive && classesActiveLink, p.class)}
      aria-current={p.isActive ? "page" : undefined}
      aria-selected={p.isActive ? "true" : undefined}
      role="tab"
    >
      {appTabGetText(appTab.resource)}
    </LinkButton>
  )
}
