import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { OrgForm } from "@/org/org_ui/form/OrgForm"
import { orgFormStateManagement } from "@/org/org_ui/form/orgFormStateManagement"
import { OrgLoader, type OrgComponentProps } from "@/org/org_ui/mutate/OrgLoader"
import type { HasFormModeMutate } from "~ui/input/form/formModeMutate"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface OrgMutateProps extends HasOrgHandle, HasFormModeMutate, MayHaveClass {}

export function OrgMutate(p: OrgMutateProps) {
  function OrgComponent(op: OrgComponentProps) {
    return <OrgMutateForm mode={p.mode} {...op} />
  }
  return <OrgLoader orgHandle={p.orgHandle} OrgComponent={OrgComponent} />
}

interface OrgMutateFormProps extends OrgComponentProps, HasFormModeMutate, MayHaveClass {}

function OrgMutateForm(p: OrgMutateFormProps) {
  const sm = orgFormStateManagement(p.mode, p.org.orgHandle, p.org)
  return <OrgForm mode={p.mode} sm={sm} />
}
