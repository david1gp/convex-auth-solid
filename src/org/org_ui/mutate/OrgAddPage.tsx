import { NavOrg } from "@/app/nav/NavOrg"
import { OrgForm } from "@/org/org_ui/form/OrgForm"
import { orgFormStateManagement } from "@/org/org_ui/form/orgFormStateManagement"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import type { MayHaveReturnPath } from "@/utils/ui/MayHaveReturnPath"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
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
  const sm = orgFormStateManagement(formMode.add)
  return <OrgForm mode={formMode.add} sm={sm} class={p.class} />
}
