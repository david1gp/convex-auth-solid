import { ResourceFileListLoader } from "#src/file/ui/list/ResourceFileListLoader.tsx"
import { ResourceFileAdd } from "#src/file/ui/mutate/ResourceFileAdd.tsx"
import { ResourceForm } from "#src/resource/ui/form/ResourceForm.tsx"
import { resourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.ts"
import { type ResourceComponentProps, ResourceLoader } from "#src/resource/ui/view/ResourceLoader.tsx"
import { formMode } from "#ui/input/form/formMode.ts"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

interface ResourceMutateProps extends MayHaveClass, HasFormModeMutate {
  resourceId: string
}

export function ResourceMutate(p: ResourceMutateProps) {
  function ResourceComponent(wp: ResourceComponentProps) {
    return (
      <>
        <ResourceMutateForm mode={p.mode} {...wp} />
        {p.mode === formMode.edit && (
          <>
            <ResourceFileListLoader mode={p.mode} resourceId={p.resourceId} />
            <ResourceFileAdd resourceId={p.resourceId} />
          </>
        )}
      </>
    )
  }
  return <ResourceLoader resourceId={p.resourceId} ResourceComponent={ResourceComponent} />
}

interface ResourceMutateFormProps extends ResourceComponentProps, HasFormModeMutate, MayHaveClass {}

function ResourceMutateForm(p: ResourceMutateFormProps) {
  const sm = resourceFormStateManagement(p.mode, p.resource.resourceId, p.resource)
  return <ResourceForm resourceId={p.resource.resourceId} mode={p.mode} sm={sm} showFiles={false} />
}
