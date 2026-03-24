import { classesActiveLink } from "#src/app/nav/links/classesActiveLink.js"
import { urlWorkspaceList } from "#src/workspace/url/urlWorkspace.js"
import { ttt } from "#ui/i18n/ttt.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"

export interface WorkspaceListLinkNavButtonProps extends MayHaveClass {
  isActive?: boolean
}

export function WorkspaceListLinkNavButton(p: WorkspaceListLinkNavButtonProps) {
  return (
    <LinkButton
      variant={buttonVariant.link}
      href={urlWorkspaceList()}
      class={classArr(p.isActive && classesActiveLink, p.class)}
      aria-current={p.isActive ? "page" : undefined}
      aria-selected={p.isActive ? "true" : undefined}
      role="tab"
    >
      {ttt("Workspaces")}
    </LinkButton>
  )
}
