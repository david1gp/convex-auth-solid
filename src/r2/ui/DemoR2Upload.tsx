import { envBaseUrlR2Result } from "@/app/env/public/envBaseUrlR2Result"
import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import { userSessionGet } from "@/auth/ui/signals/userSessionSignal"
import { fileIdGenerate } from "@/file/model_field/fileIdGenerate"
import { fileInformationGet } from "@/file/ui/stats/fileInformationGet"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import { UploadAreaFile } from "@/file/ui/upload_file/UploadAreaFile"
import { apiR2FileCreate } from "@/r2/client/apiR2FileCreate"
import { apiR2GetUploadUrl } from "@/r2/client/apiR2GetUploadUrl"
import { apiR2UploadFileWithProgress } from "@/r2/client/apiR2UploadFile"
import { Show } from "solid-js"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { createSignalObject, type SignalObject } from "~ui/utils/createSignalObject"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"

export function DemoR2Upload() {
  return (
    <LayoutWrapperApp>
      <PageWrapper>
        <R2UploadContent />
      </PageWrapper>
    </LayoutWrapperApp>
  )
}

function R2UploadContent() {
  const info = createSignalObject<UploadAreaFileInfo | null>(null)
  const uploaded = createSignalObject<string | null>(null)
  const progress = createSignalObject<{ loaded: number; total: number } | null>(null)

  function getUploadedInfo() {
    return jsonStringifyPretty(uploaded.get())
  }

  function hasUploaded() {
    return !!uploaded.get()
  }

  return (
    <>
      <UploadAreaFile
        hasUploaded={hasUploaded}
        info={info}
        handler={(e) => uploadHandler(e.currentTarget.files, info, uploaded, progress)}
      />
      <ProgressView progress={progress} />
      <ResultView uploaded={uploaded} />
    </>
  )
}

function ProgressView(p: { progress: SignalObject<{ loaded: number; total: number } | null> }) {
  const progress = p.progress
  return (
    <Show when={progress.get()}>
      <div>
        <div>
          Progress: {progress.get()!.loaded} / {progress.get()!.total} bytes
        </div>
        <div class="w-full bg-gray-200 h-2">
          <div
            class="bg-blue-500 h-2"
            style={{ width: `${(progress.get()!.loaded / progress.get()!.total) * 100}%` }}
          />
        </div>
      </div>
    </Show>
  )
}

function ResultView(p: { uploaded: SignalObject<string | null> }) {
  return (
    <Show when={p.uploaded.get()}>
      <pre class="bg-gray-100 p-4 overflow-auto text-xs">{p.uploaded.get()}</pre>
    </Show>
  )
}

async function uploadHandler(
  files: FileList | undefined | null,
  info: SignalObject<UploadAreaFileInfo | null>,
  uploaded: SignalObject<string | null>,
  progress: SignalObject<{ loaded: number; total: number } | null>,
) {
  if (!files) return

  const file = files[0]
  if (!file) return

  await fileInformationGet(file, info)

  const fileInfo = info.get()
  if (!fileInfo) {
    const errorMessage = "!fileInfo"
    console.error(errorMessage)
    uploaded.set(errorMessage)
    return
  }

  const session = userSessionGet()
  if (!session) {
    const errorMessage = "!session"
    console.error(errorMessage)
    uploaded.set(errorMessage)
    return
  }
  const token = session.token

  const baseUrlR2Result = envBaseUrlR2Result()
  if (!baseUrlR2Result.success) {
    console.error(baseUrlR2Result)
    uploaded.set(jsonStringifyPretty(baseUrlR2Result))
    return
  }
  const baseUrlR2 = baseUrlR2Result.data

  const fileId = fileIdGenerate(fileInfo.displayName)

  const urlResult = await apiR2GetUploadUrl(token, fileId)
  if (!urlResult.success) {
    console.error(urlResult)
    uploaded.set(jsonStringifyPretty(urlResult))
    return
  }
  const url = urlResult.data

  const uploadResult = await apiR2UploadFileWithProgress(url, file, (p) => {
    progress.set(p)
  })

  if (!uploadResult.success) {
    uploaded.set(jsonStringifyPretty(uploadResult))
    return
  }

  const fileCreateResult = await apiR2FileCreate({
    fileId,
    url: `${baseUrlR2}/${fileId}`,
    displayName: fileInfo.displayName,
    contentType: fileInfo.contentType,
    fileSize: fileInfo.fileSize,
    imageWidth: fileInfo.imageWidth,
    imageHeight: fileInfo.imageHeight,
  })

  uploaded.set(
    jsonStringifyPretty({
      fileId,
      message: "Upload successful!",
      fileCreateResult,
    }),
  )
}
