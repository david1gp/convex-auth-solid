import { ttc } from "@/app/i18n/ttc"
import type { FileDataUnuploaded } from "@/file/model/FileDataUnuploaded"
import { bytesToFormatedText } from "@/file/ui/stats/bytesToFormatedText"
import { classesCard } from "@/ui/card/classesCard"
import { mdiLoading } from "@mdi/js"
import { Show } from "solid-js"
import { Icon } from "~ui/static/icon/Icon"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface UploadFileStatsProps extends MayHaveClass {
  info: FileDataUnuploaded
}

export function UploadFileStats(p: UploadFileStatsProps) {
  return (
    <div class={classMerge(classesCard, "grid grid-cols-2 gap-2", "mx-auto", p.class)}>
      <Heading text={ttc("Status:")} />
      <div class="flex items-center gap-2">
        <Icon path={mdiLoading} class="size-7 animate-spin text-yellow-600" />
        <Value text={ttc("Uploading...")} />
      </div>

      <Heading text={ttc("Name:")} />
      <Value text={p.info.displayName} />

      <Heading text={ttc("Type:")} />
      <Value text={p.info.contentType} />

      <Heading text={ttc("Size:")} />
      <Value text={bytesToFormatedText(p.info.fileSize)} />

      <Show when={p.info.language}>
        <>
          <Heading text={ttc("Language:")} />
          <Value text={p.info.language?.toUpperCase() || ""} />
        </>
      </Show>
      <Show when={p.info.imageWidth && p.info.imageHeight}>
        <>
          <Heading text={ttc("Dimensions:")} />
          <Value text={`${p.info.imageWidth} x ${p.info.imageHeight}`} />
        </>
      </Show>
    </div>
  )
}

interface HeadingProps {
  text: string
}

function Heading(p: HeadingProps) {
  return <span class="text-muted-foreground">{p.text}</span>
}

function Value(p: HeadingProps) {
  return <span class="font-medium">{p.text}</span>
}
