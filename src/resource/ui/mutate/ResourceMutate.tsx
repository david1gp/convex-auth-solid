import { ResourceForm } from "@/resource/ui/form/ResourceForm"
import { resourceFormStateManagement } from "@/resource/ui/form/resourceFormStateManagement"
import { ResourceLoader, type ResourceComponentProps } from "@/resource/ui/view/ResourceLoader"
import type { HasFormModeMutate } from "~ui/input/form/formModeMutate"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
