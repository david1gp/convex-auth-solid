import { classesActiveLink } from "#src/app/nav/links/classesActiveLink.ts"
import { urlWorkspaceList } from "#src/workspace/workspace_url/urlWorkspace.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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
