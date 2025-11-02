import { NavWorkspace } from "@/app/nav/NavWorkspace"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import { createMutation } from "@/utils/convex/createMutation"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import {
  workspaceCreateFormStateManagement,
  type WorkspaceFormData,
} from "@/workspace/ui/form/workspaceCreateFormStateManagement"
import { WorkspaceForm } from "@/workspace/ui/form/WorkspaceForm"
import { urlWorkspaceView } from "@/workspace/url/urlWorkspace"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function WorkspaceAddPage() {
  return (
    <PageWrapper>
      <NavWorkspace getWorkspacePageTitle={getPageTitle}>
        <LinkLikeText>{ttt("Add")}</LinkLikeText>
      </NavWorkspace>
      <WorkspaceAdd />
    </PageWrapper>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return ttt("Create new Workspace")
}

export interface WorkspaceAddProps extends MayHaveReturnPath, MayHaveClass {}

export function WorkspaceAdd(p: WorkspaceAddProps) {
  const navigator = useNavigate()
  const actionFn = createMutation(api.workspace.workspaceCreateMutation)

  async function createAction(data: WorkspaceFormData): Promise<void> {
    const workspaceIdResult = await actionFn({
      token: userTokenGet(),
      // data
      ...data,
    })
    if (!workspaceIdResult.success) {
      console.error(workspaceIdResult)
      toastAdd({ title: workspaceIdResult.errorMessage, variant: toastVariant.error })
      return
    }
    // const workspaceId = await getMutationAdd(p.session, state)
    const url = p.returnPath ?? urlWorkspaceView(workspaceIdResult.data)
    navigator(url)
  }

  const sm = workspaceCreateFormStateManagement({ create: createAction })
  return <WorkspaceForm mode={formMode.add} sm={sm} class={p.class} />
}
