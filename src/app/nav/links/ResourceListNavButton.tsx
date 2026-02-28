import { classesActiveLink } from "@/app/nav/links/classesActiveLink"
import { appTab, appTabIcon } from "@/app/tabs/appTab"
import { appTabGetText } from "@/app/tabs/appTabGetText"
import { urlResourceList } from "@/resource/url/urlResource"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
