import type { UploadAreaFileInfo } from "#src/file/ui/stats/UploadAreaFileInfo.js"
import { fileInformationGet } from "#src/file/ui/stats/fileInformationGet.js"
import { UploadAreaFile } from "#src/file/ui/upload_file/UploadAreaFile.js"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { createSignalObject } from "#ui/utils/createSignalObject.js"

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
