import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import { fileInformationGet } from "@/file/ui/stats/fileInformationGet"
import { UploadAreaFile } from "@/file/ui/upload_file/UploadAreaFile"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { createSignalObject } from "~ui/utils/createSignalObject"

export function DemoUploadArea() {
  const info = createSignalObject<UploadAreaFileInfo | null>(null)

  return (
    <PageWrapper>
      <h1 class="mb-4 text-lg font-semibold">File upload with image preview</h1>
      <div class="rounded-lg border bg-card p-6">
        <UploadAreaFile
          hasUploaded={() => false}
          info={info}
          handler={(e) => {
            const files = e.currentTarget.files
            if (files && files[0]) {
              fileInformationGet(files[0], info)
            }
          }}
        />
      </div>
    </PageWrapper>
  )
}
