import { language, languageOrNone } from "@/app/i18n/language"
import { ttc } from "@/app/i18n/ttc"
import type { HasFileModel } from "@/file/model/HasFileModel"
import { downloadFileByUrl } from "@/file/ui/list/downloadFileByUrl"
import { bytesToFormatedText } from "@/file/ui/stats/bytesToFormatedText"
import type { MayHaveResourceId } from "@/resource/model/MayHaveResourceId"
import { classesCard } from "@/ui/card/classesCard"
import { ClipboardCopyButtonIcon } from "@/ui/links/ClipboardCopyButtonIcon"
import { mdiDownload, mdiEye } from "@mdi/js"
import { Show } from "solid-js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface FileCardViewProps extends MayHaveResourceId, HasFileModel, MayHaveClass, MayHaveChildren {
  showDownload?: boolean
}

export function FileCardView(p: FileCardViewProps) {
  return (
    <article
      class={classMerge(
        classesCard,
        "flex flex-col", // layout children
        p.class,
      )}
    >
      <div class="flex flex-wrap gap-2">
        <h3 class="text-xl font-semibold break-all font-mono flex items-center flex-1">{p.file.displayName}</h3>
        {p.children}
      </div>
      <div class="flex flex-wrap gap-6 text-muted-foreground mb-2">
        <Show when={p.file.language !== languageOrNone.none}>
          <span>{(p.file.language || language.en).toUpperCase()}</span>
          <div>•</div>
        </Show>
        <div>{bytesToFormatedText(p.file.fileSize)}</div>
        <div>•</div>
        <div>{p.file.contentType}</div>
      </div>
      <div class="flex flex-wrap gap-2">
        {(p.showDownload === undefined || p.showDownload) && (
          <ButtonIcon
            icon={mdiDownload}
            variant={buttonVariant.subtle}
            onClick={(e) => {
              e.preventDefault()
              downloadFileByUrl(p.file.url, p.file.displayName)
            }}
            class="flex-1"
          >
            {ttc("Download")}
          </ButtonIcon>
        )}
        <LinkButton icon={mdiEye} href={p.file.url} variant={buttonVariant.subtle} newTab class="flex-1">
          {ttc("View")}
        </LinkButton>
        <ClipboardCopyButtonIcon
          variant={buttonVariant.subtle}
          data={p.file.url}
          copyText={ttc("Copy URL to clipboard")}
          toastText={ttc("URL copied")}
        >
          {ttc("Copy URL")}
        </ClipboardCopyButtonIcon>
      </div>
    </article>
  )
}
