import type { HasFileId } from "@/file/model_field/HasFileId"
import { fileNameSet } from "@/file/ui/fileNameRecordSignal"
import { FileForm } from "@/file/ui/form/FileForm"
import { fileFormStateManagement } from "@/file/ui/form/fileFormStateManagement"
import { FileLoader, type FileComponentProps } from "@/file/ui/mutate/FileLoader"
import type { HasResourceId } from "@/resource/model/HasResourceId"
import { createEffect } from "solid-js"
import type { HasFormModeMutate } from "~ui/input/form/formModeMutate"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
