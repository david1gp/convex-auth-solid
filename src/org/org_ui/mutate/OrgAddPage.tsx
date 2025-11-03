import { NavOrg } from "@/app/nav/NavOrg"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { OrgForm } from "@/org/org_ui/form/OrgForm"
import { orgFormStateManagement, type OrgFormData } from "@/org/org_ui/form/orgFormStateManagement"
import { urlOrgView } from "@/org/org_url/urlOrg"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
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
      <NavOrg getOrgPageTitle={getPageTitle}>
        <LinkLikeText>{ttt("Add")}</LinkLikeText>
      </NavOrg>
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
  const sm = orgFormStateManagement({ create: addAction })
  return <OrgForm mode={formMode.add} sm={sm} class={p.class} />
}
