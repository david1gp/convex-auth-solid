import type { HasFileModel } from "#src/file/model/HasFileModel.js"
import { FileCardView } from "#src/file/ui/list/FileCardView.js"
import { urlFileEdit, urlFileRemove } from "#src/file/url/urlFile.js"
import type { HasResourceId } from "#src/resource/model/HasResourceId.js"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode"
import { formModeIcon } from "#ui/input/form/formModeIcon"
import { buttonVariant } from "#ui/interactive/button/buttonCva"
import { LinkButtonIconOnly } from "#ui/interactive/link/LinkButtonIconOnly"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
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
