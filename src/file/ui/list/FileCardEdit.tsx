import type { HasFileModel } from "#src/file/model/HasFileModel.ts"
import { FileCardView } from "#src/file/ui/list/FileCardView.tsx"
import { urlFileEdit, urlFileRemove } from "#src/file/url/urlFile.ts"
import type { HasResourceId } from "#src/resource/model/HasResourceId.ts"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode.ts"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonIconOnly } from "#ui/interactive/link/LinkButtonIconOnly.jsx"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { splitProps } from "solid-js"

export interface FileCardEditProps extends HasResourceId, HasFileModel, MayHaveClass, MayHaveChildren {}

export function FileCardEdit(p: FileCardEditProps) {
  const [s, rest] = splitProps(p, ["resourceId"])
  return (
    <FileCardView {...rest}>
      <LinkButtonIconOnly
        icon={formModeIcon.edit}
        href={urlFileEdit(s.resourceId, rest.file.fileId)}
        variant={buttonVariant.ghost}
        title={getFormModeTitle(formMode.edit, "File")}
      />
      <LinkButtonIconOnly
        icon={formModeIcon.remove}
        href={urlFileRemove(s.resourceId, rest.file.fileId)}
        variant={buttonVariant.ghost}
        title={getFormModeTitle(formMode.remove, "File")}
      />
    </FileCardView>
  )
}
