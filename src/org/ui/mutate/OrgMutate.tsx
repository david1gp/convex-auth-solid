import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrg } from "@/org/convex/IdOrg"
import type { HasOrgHandle } from "@/org/model/HasOrgHandle"
import {
  orgCreateFormStateManagement,
  type OrgFormActions,
  type OrgFormData,
} from "@/org/ui/form/orgCreateFormStateManagement"
import { OrgForm } from "@/org/ui/form/OrgForm"
import { urlOrgList, urlOrgView } from "@/org/url/urlOrg"
import { createMutation } from "@/utils/convex/createMutation"
import { createQuery } from "@/utils/convex/createQuery"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { Show, createEffect } from "solid-js"
import { formMode, type HasFormModeMutate } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface OrgMutateProps extends HasOrgHandle, HasFormModeMutate, MayHaveReturnPath, MayHaveClass {}

export function OrgMutate(p: OrgMutateProps) {
  const op = "OrgMutate"
  const navigator = useNavigate()
  const getOrg = createQuery(api.org.orgGetQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  }) as () => DocOrg | undefined

  const editMutation = createMutation(api.org.orgEditMutation)
  const deleteMutation = createMutation(api.org.orgDeleteMutation)

  async function editAction(data: Partial<OrgFormData>) {
    const org = getOrg()
    if (!org) {
      console.warn("no org")
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
    const url = (p.returnPath ?? p.mode === formMode.edit) ? urlOrgView(p.orgHandle) : urlOrgList()
    navigator(url)
  }

  async function deleteAction() {
    const org = getOrg()
    if (!org) {
      console.warn("no org")
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
    const url = (p.returnPath ?? p.mode === formMode.edit) ? urlOrgView(p.orgHandle) : urlOrgList()
    navigator(url)
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
    const o = getOrg()
    if (!o) {
      return
    }
    sm.loadData(o)
  })

  return (
    <Show when={getOrg()} fallback={<LoadingOrg />}>
      <OrgForm mode={p.mode} sm={sm} />
    </Show>
  )
}

function LoadingOrg() {
  return <div class="opacity-80">Loading organization...</div>
}
