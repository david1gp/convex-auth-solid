import { ttc } from "@/app/i18n/ttc"
import type { FileModel } from "@/file/model/FileModel"
import { FileCardView, type FileCardViewProps } from "@/file/ui/list/FileCardView"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import { UploadAreaFile } from "@/file/ui/upload_file/UploadAreaFile"
import { resourceFormField } from "@/resource/ui/form/resourceFormField"
import { type ResourceFormStateManagement } from "@/resource/ui/form/resourceFormStateManagement"
import { classesCard } from "@/ui/card/classesCard"
import { mdiTrashCanOutline } from "@mdi/js"
import { For, Show, splitProps } from "solid-js"
import { formMode, getFormModeTitle } from "~ui/input/form/formMode"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { Label } from "~ui/input/label/Label"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { ButtonIconOnly } from "~ui/interactive/button/ButtonIconOnly"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classArr } from "~ui/utils/classArr"
import { createSignalObject } from "~ui/utils/createSignalObject"

interface HasResourceFormStateManagement {
  sm: ResourceFormStateManagement
}

export function ResourceFormFiles(p: HasResourceFormStateManagement) {
  const uploadInfo = createSignalObject<UploadAreaFileInfo | null>(null)
  const uploadError = createSignalObject<string | null>(null)

  function hasUploaded() {
    return !!uploadInfo.get()
  }

  function getCurrentFiles() {
    return p.sm.state.fileIds.get()
  }

  function handleRemoveFile(fileId: string) {
    const currentFiles = getCurrentFiles()
    const updatedFiles = currentFiles.filter((f) => f.fileId !== fileId)
    p.sm.state.fileIds.set(updatedFiles)
    p.sm.validateOnChange(resourceFormField.files)(updatedFiles.join(","))
    p.sm.debouncedSave()
  }

  function handleUploadSuccess(file: FileModel) {
    const currentFiles = getCurrentFiles()
    p.sm.state.fileIds.set([...currentFiles, file])
    p.sm.debouncedSave()
  }

  return (
    <div class="space-y-4">
      {/* Display existing uploaded files */}
      <UploadedFilesList getCurrentFiles={getCurrentFiles} handleRemoveFile={handleRemoveFile} />

      {/* Upload new files */}
      <div class="flex flex-col gap-2">
        <Label>{ttc("Upload file")}</Label>
        <UploadAreaFile
          resourceId={p.sm.state.resourceId.get() || undefined}
          hasUploaded={hasUploaded}
          info={uploadInfo}
          error={uploadError}
          onUploadSuccess={handleUploadSuccess}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
          class={classArr(classesCard)}
        />
      </div>

      {/* Show error if any */}
      <Show when={p.sm.errors.fileIds.get()}>
        <p class="text-destructive text-sm">{p.sm.errors.fileIds.get()}</p>
      </Show>
    </div>
  )
}

interface UploadedFilesListProps extends MayHaveClass {
  getCurrentFiles(): FileModel[]
  handleRemoveFile: (fileId: string) => void
}

function UploadedFilesList(p: UploadedFilesListProps) {
  return (
    <div class="space-y-2">
      <Label>{ttc("Uploaded files")}</Label>
      <div class="space-y-2">
        <For each={p.getCurrentFiles()} fallback={<p class="text-muted-foreground">{ttc("No files uploaded yet")}</p>}>
          {(file) => <FileCardEdit handleRemoveFile={p.handleRemoveFile} file={file} />}
        </For>
      </div>
    </div>
  )
}

interface FileCardProps extends FileCardViewProps {
  handleRemoveFile: (fileId: string) => void
}

function FileCardEdit(p: FileCardProps) {
  const [s, rest] = splitProps(p, ["handleRemoveFile"])
  return (
    <FileCardView {...rest} showDownload={false}>
      <ButtonIconOnly
        icon={formModeIcon.remove}
        variant={buttonVariant.ghost}
        title={getFormModeTitle(formMode.remove, "File")}
        onClick={() => s.handleRemoveFile(p.file.fileId)}
      />
    </FileCardView>
  )
}

function UploadedFileIdList(p: UploadedFilesListProps) {
  return (
    <div class="space-y-2">
      <Label>{ttc("Uploaded files")}</Label>
      <div class="space-y-2">
        <For each={p.getCurrentFiles()} fallback={<p class="text-muted-foreground">{ttc("No files uploaded yet")}</p>}>
          {(file) => (
            <div class="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{file.fileId}</p>
                <p class="text-xs text-muted-foreground">{ttc("File ID")}</p>
              </div>
              <ButtonIcon
                icon={mdiTrashCanOutline}
                variant={buttonVariant.outline}
                onClick={() => p.handleRemoveFile(file.fileId)}
                class="ml-2"
              >
                {ttc("Remove")}
              </ButtonIcon>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
