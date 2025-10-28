import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrg } from "@/org/convex/IdOrg"
import type { HasOrgSlug } from "@/org/model/HasOrgSlug"
import { orgCreateFormStateManagement, type OrgFormData } from "@/org/ui/form/orgCreateFormStateManagement"
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

interface OrgMutateProps extends HasOrgSlug, HasFormModeMutate, MayHaveReturnPath, MayHaveClass {}

export function OrgMutate(p: OrgMutateProps) {
  const op = "OrgMutate"
  const navigator = useNavigate()
  const getOrg = createQuery(api.org.orgGetQuery, {
    token: userTokenGet(),
    slug: p.orgSlug,
  }) as () => DocOrg | undefined

  const editAction = createMutation(api.org.orgEditMutation)
  const deleteAction = createMutation(api.org.orgDeleteMutation)
  async function action(data: OrgFormData): Promise<void> {
    const org = getOrg()
    if (!org) {
      console.warn("no org")
      return
    }
    const orgIdResult =
      p.mode === formMode.edit
        ? await editAction({
            // auth
            token: userTokenGet(),
            // id
            orgId: org._id,
            // data
            ...data,
          })
        : await deleteAction({
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
    const url = (p.returnPath ?? p.mode === formMode.edit) ? urlOrgView(p.orgSlug) : urlOrgList()
    navigator(url)
  }

  const sm = orgCreateFormStateManagement(action)

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
