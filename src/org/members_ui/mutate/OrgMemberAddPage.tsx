import { NavAppDir } from "@/app/nav/NavAppDir"
import type { IdUser } from "@/auth/convex/IdUser"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { urlOrgMemberView } from "@/org/member_url/urlOrgMember"
import {
  orgMemberEditFormStateManagement,
  type OrgMemberFormData,
} from "@/org/members_ui/form/orgMemberEditFormStateManagement"
import { OrgMemberForm } from "@/org/members_ui/form/OrgMemberForm"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import { createMutation } from "@/utils/convex/createMutation"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import { api } from "@convex/_generated/api"
import { useNavigate, useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function OrgMemberAddPage() {
  const params = useParams()
  const getReturnPath = () => params.returnPath
  const getOrgHandle = () => params.orgHandle
  return (
    <Switch>
      <Match when={!getOrgHandle()}>
        <ErrorPage title={ttt("Missing :memberId in path")} />
      </Match>
      <Match when={getOrgHandle()}>
        <PageWrapper>
          <NavAppDir getPageTitle={getPageTitle} />
          <OrgMemberAdd orgHandle={getOrgHandle()!} returnPath={getReturnPath()} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return ttt("Add new Organization Member")
}

export interface OrgMemberAddProps extends HasOrgHandle, MayHaveReturnPath, MayHaveClass {}

export function OrgMemberAdd(p: OrgMemberAddProps) {
  const navigator = useNavigate()
  const addMutation = createMutation(api.org.orgMemberCreateMutation)

  async function addAction(data: OrgMemberFormData): Promise<void> {
    const memberIdResult = await addMutation({
      // auth
      token: userTokenGet(),
      // ids
      orgHandle: p.orgHandle,
      userId: data.userId as IdUser,
      // data
      role: data.role,
    })
    if (!memberIdResult.success) {
      console.error(memberIdResult)
      toastAdd({ title: memberIdResult.errorMessage, variant: toastVariant.error })
      return
    }
    const url = p.returnPath ?? urlOrgMemberView(p.orgHandle, memberIdResult.data)
    navigator(url)
  }
  const sm = orgMemberEditFormStateManagement({ add: addAction })
  return <OrgMemberForm mode={formMode.add} sm={sm} class={p.class} />
}
