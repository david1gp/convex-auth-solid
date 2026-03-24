import { ResourceForm } from "#src/resource/ui/form/ResourceForm.js"
import { resourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.js"
import { ResourceLoader, type ResourceComponentProps } from "#src/resource/ui/view/ResourceLoader.js"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"

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
