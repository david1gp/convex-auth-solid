import { NavAppDir } from "@/app/nav/NavAppDir"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { orgCreateFormStateManagement, type OrgFormData } from "@/org/org_ui/form/orgCreateFormStateManagement"
import { OrgForm } from "@/org/org_ui/form/OrgForm"
import { urlOrgView } from "@/org/org_url/urlOrg"
import { createMutation } from "@/utils/convex/createMutation"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import { api } from "@convex/_generated/api"
import { useNavigate } from "@solidjs/router"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function OrgAddPage() {
  return (
    <PageWrapper>
      <NavAppDir getPageTitle={getPageTitle} />
      <OrgAdd />
    </PageWrapper>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return ttt("Create new Organization")
}

export interface OrgAddProps extends MayHaveReturnPath, MayHaveClass {}

export function OrgAdd(p: OrgAddProps) {
  const navigator = useNavigate()
  const addMutation = createMutation(api.org.orgCreateMutation)
  async function addAction(data: OrgFormData): Promise<void> {
    const orgIdResult = await addMutation({
      token: userTokenGet(),
      // data
      ...data,
    })
    if (!orgIdResult.success) {
      console.error(orgIdResult)
      toastAdd({ title: orgIdResult.errorMessage, variant: toastVariant.error })
      return
    }
    // const orgId = await getMutationAdd(p.session, state)
    const url = p.returnPath ?? urlOrgView(sm.state.orgHandle.get())
    navigator(url)
  }
  const sm = orgCreateFormStateManagement({ create: addAction })
  return <OrgForm mode={formMode.add} sm={sm} class={p.class} />
}
