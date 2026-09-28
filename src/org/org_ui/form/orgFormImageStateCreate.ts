import type { UploadAreaFileInfo } from "#src/file/ui/stats/UploadAreaFileInfo.ts"
import { orgFormField } from "#src/org/org_ui/form/orgFormField.ts"
import type { OrgFormStateManagement } from "#src/org/org_ui/form/orgFormStateManagement.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function orgFormImageStateCreate(sm: () => OrgFormStateManagement) {
  const uploadInfo = createSignalObject<UploadAreaFileInfo | null>(null)
  const uploadError = createSignalObject<string | null>(null)
  function imageChange(value: string) {
    sm().state.image.set(value)
    sm().validateOnChange(orgFormField.image)(value)
  }
  return {
    uploadInfo,
    uploadError,
    hasUploaded: () => !!uploadInfo.get(),
    hasImageUrl: () => !!sm().state.image.get(),
    imageChange,
    imageRemove: () => imageChange(""),
  }
}
