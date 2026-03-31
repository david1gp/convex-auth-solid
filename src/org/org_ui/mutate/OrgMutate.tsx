import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import { OrgForm } from "#src/org/org_ui/form/OrgForm.tsx"
import { orgFormStateManagement } from "#src/org/org_ui/form/orgFormStateManagement.ts"
import { OrgLoader, type OrgComponentProps } from "#src/org/org_ui/mutate/OrgLoader.tsx"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

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
