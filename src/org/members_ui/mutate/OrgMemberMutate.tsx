import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrgMember, IdOrgMember } from "@/org/convex/IdOrg"
import { urlOrgMemberList, urlOrgMemberView } from "@/org/member_url/urlOrgMember"
import {
  orgMemberEditFormStateManagement,
  type OrgMemberFormActions,
  type OrgMemberFormData,
} from "@/org/members_ui/form/orgMemberEditFormStateManagement"
import { OrgMemberForm } from "@/org/members_ui/form/OrgMemberForm"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import type { HasOrgMemberId } from "@/org/org_model/HasOrgMemberId"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createMutation } from "@/utils/convex/createMutation"
import { createQuery } from "@/utils/convex/createQuery"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { Show, createEffect } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, type HasFormModeMutate } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface OrgMemberMutateProps
  extends HasOrgHandle,
    HasOrgMemberId,
    HasFormModeMutate,
    MayHaveReturnPath,
    MayHaveClass {}

export function OrgMemberMutate(p: OrgMemberMutateProps) {
  const op = "OrgMemberMutate"
  const navigator = useNavigate()
  const getMember = createQuery(api.org.orgMemberGetQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
    memberId: p.memberId as IdOrgMember,
  }) as () => DocOrgMember | undefined

  const editMutation = createMutation(api.org.orgMemberEditMutation)
  const deleteMutation = createMutation(api.org.orgMemberDeleteMutation)

  async function editAction(data: OrgMemberFormData) {
    const member = getMember()
    if (!member) {
      console.warn("no member")
      return
    }
    const result = await editMutation({
      token: userTokenGet(),
      orgHandle: p.orgHandle,
      memberId: member._id,
      role: data.role,
    })
    if (!result.success) {
      console.error(result)
      toastAdd({ title: result.errorMessage, variant: toastVariant.error })
      return
    }
    const url =
      (p.returnPath ?? p.mode === formMode.edit)
        ? urlOrgMemberView(p.orgHandle, p.memberId)
        : urlOrgMemberList(p.orgHandle)
    navigator(url)
  }

  async function deleteAction() {
    const member = getMember()
    if (!member) {
      console.warn("no member")
      return
    }
    const result = await deleteMutation({
      token: userTokenGet(),
      orgHandle: p.orgHandle,
      memberId: member._id,
    })
    if (!result.success) {
      console.error(result)
      toastAdd({ title: result.errorMessage, variant: toastVariant.error })
      return
    }
    const url =
      (p.returnPath ?? p.mode === formMode.edit)
        ? urlOrgMemberView(p.orgHandle, p.memberId)
        : urlOrgMemberList(p.orgHandle)
    navigator(url)
  }

  const actions: OrgMemberFormActions = {}
  if (p.mode === formMode.edit) {
    actions.edit = editAction
  }
  if (p.mode === formMode.remove) {
    actions.remove = deleteAction
  }

  const sm = orgMemberEditFormStateManagement(actions)

  createEffect(() => {
    const m = getMember()
    if (!m) {
      return
    }
    sm.loadData(m)
  })

  return (
    <Show when={getMember()} fallback={<OrgMemberLoading />}>
      <OrgMemberForm mode={p.mode} sm={sm} />
    </Show>
  )
}

function OrgMemberLoading() {
  return <LoadingSection loadingSubject={ttt("Organization Member")} />
}
