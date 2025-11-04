import { urlWorkspaceList } from "@/workspace/url/urlWorkspace"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"

export function WorkspaceListLinkButton() {
  return (
    <LinkButton variant={buttonVariant.link} href={urlWorkspaceList()}>
      {ttt("Workspaces")}
    </LinkButton>
  )
}
