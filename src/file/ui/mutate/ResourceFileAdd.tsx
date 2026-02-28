import { ttc } from "@/app/i18n/ttc"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import { UploadAreaFile } from "@/file/ui/upload_file/UploadAreaFile"
import type { HasResourceId } from "@/resource/model/HasResourceId"
import { urlResourceList, urlResourceView } from "@/resource/url/urlResource"
import { classesCard } from "@/ui/card/classesCard"
import { mdiArrowLeft, mdiEye } from "@mdi/js"
import { Show } from "solid-js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classArr } from "~ui/utils/classArr"
import { createSignalObject } from "~ui/utils/createSignalObject"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"

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
