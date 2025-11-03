import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import { OrgForm } from "@/org/org_ui/form/OrgForm"
import {
  orgFormStateManagement,
  type OrgFormActions,
  type OrgFormData,
} from "@/org/org_ui/form/orgFormStateManagement"
import { OrgLoader, type OrgComponentProps } from "@/org/org_ui/mutate/OrgLoader"
import { urlOrgList, urlOrgView } from "@/org/org_url/urlOrg"
import { createMutation } from "@/utils/convex/createMutation"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { formMode, type HasFormModeMutate } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface OrgMutateProps extends HasOrgHandle, HasFormModeMutate, MayHaveReturnPath, MayHaveClass {}

export function OrgMutate(p: OrgMutateProps) {
  function OrgComponent(op: OrgComponentProps) {
    return <OrgMutateForm mode={p.mode} {...op} />
  }
  return <OrgLoader orgHandle={p.orgHandle} OrgComponent={OrgComponent} />
}

interface OrgMutateFormProps extends OrgComponentProps, HasFormModeMutate, MayHaveReturnPath, MayHaveClass {}

function OrgMutateForm(p: OrgMutateFormProps) {
  const navigator = useNavigate()
  const editMutation = createMutation(api.org.orgEditMutation)
  const deleteMutation = createMutation(api.org.orgDeleteMutation)

  async function editAction(data: Partial<OrgFormData>) {
    console.log("editAction", data)
    const orgIdResult = await editMutation({
      // auth
      token: userTokenGet(),
      // id
      orgId: p.org._id,
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
    console.log("deleteAction")
    const orgIdResult = await deleteMutation({
      // auth
      token: userTokenGet(),
      // id
      orgId: p.org._id,
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
    if (p.mode === formMode.edit) return urlOrgView(p.org.orgHandle)
    return urlOrgList()
  }

  const actions: OrgFormActions = {}
  if (p.mode === formMode.edit) {
    actions.edit = editAction
  }
  if (p.mode === formMode.remove) {
    actions.delete = deleteAction
  }

  const sm = orgFormStateManagement(actions)
  sm.loadData(p.org)

  return <OrgForm mode={p.mode} sm={sm} />
}
