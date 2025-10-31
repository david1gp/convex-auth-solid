import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrg } from "@/org/org_convex/IdOrg"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import {
  orgCreateFormStateManagement,
  type OrgFormActions,
  type OrgFormData,
} from "@/org/org_ui/form/orgCreateFormStateManagement"
import { OrgForm } from "@/org/org_ui/form/OrgForm"
import { urlOrgList, urlOrgView } from "@/org/org_url/urlOrg"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createMutation } from "@/utils/convex/createMutation"
import { createQuery } from "@/utils/convex/createQuery"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { Show, createEffect, type Accessor } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, type HasFormModeMutate } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { Result } from "~utils/result/Result"

interface OrgMutateProps extends HasOrgHandle, HasFormModeMutate, MayHaveReturnPath, MayHaveClass {}

export function OrgMutate(p: OrgMutateProps) {
  const op = "OrgMutate"
  const navigator = useNavigate()
  const getOrg: Accessor<Result<DocOrg | null> | undefined> = createQuery(api.org.orgGetQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })

  const editMutation = createMutation(api.org.orgEditMutation)
  const deleteMutation = createMutation(api.org.orgDeleteMutation)

  async function editAction(data: Partial<OrgFormData>) {
    const orgResult = getOrg()
    if (!orgResult || !orgResult.success) {
      console.warn(orgResult)
      return
    }
    const org = orgResult.data
    if (!org) {
      console.warn("!org")
      return
    }
    const orgIdResult = await editMutation({
      // auth
      token: userTokenGet(),
      // id
      orgId: org._id,
      // data
      ...data,
    })
    if (!orgIdResult.success) {
      console.error(orgIdResult)
      toastAdd({ title: orgIdResult.errorMessage, variant: toastVariant.error })
      return
    }
    navigator(getReturnPath())
  }

  async function deleteAction() {
    const orgResult = getOrg()
    if (!orgResult || !orgResult.success) {
      console.warn(orgResult)
      return
    }
    const org = orgResult.data
    if (!org) {
      console.warn("!org")
      return
    }
    const orgIdResult = await deleteMutation({
      // auth
      token: userTokenGet(),
      // id
      orgId: org._id,
    })
    if (!orgIdResult.success) {
      console.error(orgIdResult)
      toastAdd({ title: orgIdResult.errorMessage, variant: toastVariant.error })
      return
    }
    navigator(getReturnPath())
  }
  function getReturnPath() {
    if (p.returnPath) return p.returnPath
    if (p.mode === formMode.edit) return urlOrgView(p.orgHandle)
    return urlOrgList()
  }

  const actions: OrgFormActions = {}
  if (p.mode === formMode.edit) {
    actions.edit = editAction
  }
  if (p.mode === formMode.remove) {
    actions.delete = deleteAction
  }

  const sm = orgCreateFormStateManagement(actions)

  createEffect(() => {
    const orgResult = getOrg()
    if (!orgResult) {
      // console.warn("!orgResult")
      return
    }
    if (!orgResult.success) {
      console.warn(orgResult)
      return
    }
    const org = orgResult.data
    if (!org) {
      console.warn("!org")
      return
    }
    sm.loadData(org)
  })

  return (
    <Show when={getOrg()} fallback={<OrgLoading />}>
      <OrgForm mode={p.mode} sm={sm} />
    </Show>
  )
}

function OrgLoading() {
  return <LoadingSection loadingSubject={ttt("Organization")} />
}
