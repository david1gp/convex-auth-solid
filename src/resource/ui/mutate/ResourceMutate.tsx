import { ResourceForm } from "#src/resource/ui/form/ResourceForm.tsx"
import { resourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.ts"
import { ResourceLoader, type ResourceComponentProps } from "#src/resource/ui/view/ResourceLoader.tsx"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

interface ResourceMutateProps extends MayHaveClass, HasFormModeMutate {
  resourceId: string
}

export function ResourceMutate(p: ResourceMutateProps) {
  function ResourceComponent(wp: ResourceComponentProps) {
    return <ResourceMutateForm mode={p.mode} {...wp} />
  }
  return <ResourceLoader resourceId={p.resourceId} ResourceComponent={ResourceComponent} />
}

interface ResourceMutateFormProps extends ResourceComponentProps, HasFormModeMutate, MayHaveClass {}

function ResourceMutateForm(p: ResourceMutateFormProps) {
  const sm = resourceFormStateManagement(p.mode, p.resource.resourceId, p.resource, p.files)
  return <ResourceForm resourceId={p.resource.resourceId} mode={p.mode} sm={sm} />
}
