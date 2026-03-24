import { ttc } from "#src/app/i18n/ttc.js"
import type { UploadAreaFileInfo } from "#src/file/ui/stats/UploadAreaFileInfo.js"
import { UploadAreaFile } from "#src/file/ui/upload_file/UploadAreaFile.jsx"
import type { HasResourceId } from "#src/resource/model/HasResourceId.js"
import { urlResourceList, urlResourceView } from "#src/resource/url/urlResource.js"
import { classesCard } from "#src/ui/card/classesCard.js"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { classArr } from "#ui/utils/classArr.js"
import { createSignalObject } from "#ui/utils/createSignalObject.js"
import { jsonStringifyPretty } from "#utils/json/jsonStringifyPretty.js"
import { mdiArrowLeft, mdiEye } from "@mdi/js"
import { Show } from "solid-js"

export interface ResourceFileAddProps extends HasResourceId {}

export function ResourceFileAdd(p: ResourceFileAddProps) {
  const info = createSignalObject<UploadAreaFileInfo | null>(null)
  const uploaded = createSignalObject<string | null>(null)
  const error = createSignalObject<string | null>(null)

  function getUploadedInfo() {
    return jsonStringifyPretty(uploaded.get())
  }

  function hasUploaded() {
    return !!uploaded.get()
  }

  return (
    <>
      <UploadAreaFile
        resourceId={p.resourceId}
        hasUploaded={hasUploaded}
        info={info}
        error={error}
        onUploadSuccess={(data) => uploaded.set(data.url)}
        class={classArr(classesCard, "my-4")}
      />
      <Show when={hasUploaded()}>
        <div class="flex flex-wrap gap-2 justify-center">
          <LinkButton variant={buttonVariant.link} icon={mdiArrowLeft} href={urlResourceList()}>
            {ttc("Resources")}
          </LinkButton>
          <LinkButton variant={buttonVariant.link} icon={mdiEye} href={urlResourceView(p.resourceId)}>
            {ttc("View resource")}
          </LinkButton>
        </div>
      </Show>
    </>
  )
}
