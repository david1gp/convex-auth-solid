import { classesActiveLink } from "@/app/nav/links/classesActiveLink"
import { urlWorkspaceList } from "@/workspace/url/urlWorkspace"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
