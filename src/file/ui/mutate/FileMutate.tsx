import type { HasFileId } from "#src/file/model_field/HasFileId.js"
import { fileNameSet } from "#src/file/ui/fileNameRecordSignal.js"
import { FileForm } from "#src/file/ui/form/FileForm.jsx"
import { fileFormStateManagement } from "#src/file/ui/form/fileFormStateManagement.js"
import { FileLoader, type FileComponentProps } from "#src/file/ui/mutate/FileLoader.jsx"
import type { HasResourceId } from "#src/resource/model/HasResourceId.js"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { createEffect } from "solid-js"

interface FileMutateProps extends HasFileId, HasResourceId, HasFormModeMutate, MayHaveClass {}

export function FileMutate(p: FileMutateProps) {
  function FileComponent(wp: FileComponentProps) {
    createEffect(() => {
      if (!wp) return
      fileNameSet(wp.file.fileId, wp.file.displayName)
    })
    return <FileMutateForm fileId={p.fileId} resourceId={p.resourceId} mode={p.mode} {...wp} />
  }
  return <FileLoader fileId={p.fileId} FileComponent={FileComponent} />
}

interface FileMutateFormProps extends HasFileId, HasResourceId, HasFormModeMutate, FileComponentProps, MayHaveClass {}

function FileMutateForm(p: FileMutateFormProps) {
  const sm = fileFormStateManagement(p.mode, p.file)
  return <FileForm fileId={p.file.fileId} resourceId={p.resourceId} mode={p.mode} sm={sm} />
}
