import { ttc } from "#src/app/i18n/ttc.ts"
import type { HasFileModel } from "#src/file/model/HasFileModel.ts"
import { downloadFileByUrl } from "#src/file/ui/list/downloadFileByUrl.tsx"
import { urlFileEdit, urlFileRemove } from "#src/file/url/urlFile.ts"
import type { HasResourceId } from "#src/resource/model/HasResourceId.ts"
import { ClipboardCopyButtonIconOnly } from "#src/ui/links/ClipboardCopyButtonIconOnly.tsx"
import { type HasFormMode, formMode, getFormModeTitle } from "#ui/input/form/formMode.ts"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { ButtonIconOnly } from "#ui/interactive/button/ButtonIconOnly.jsx"
import { LinkButtonIconOnly } from "#ui/interactive/link/LinkButtonIconOnly.jsx"
import { classesCardWrapper } from "#ui/static/card/classesCardWrapper.ts"
import { classMerge } from "#ui/utils/classMerge.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { mdiDownload, mdiEye } from "@mdi/js"
import { Show } from "solid-js"

interface FileCardLineProps extends HasResourceId, HasFormMode, HasFileModel, MayHaveClass {}

export function FileCardLine(p: FileCardLineProps) {
  return (
    <article
      class={classMerge(
        classesCardWrapper,
        "shadow-sm", // override card style
        "pl-4 pr-2 py-2", // padding
        "flex flex-wrap gap-2", // layout children
        p.class,
      )}
    >
      <h3 class="text-lg font-semibold break-all font-mono flex items-center flex-1">{p.file.displayName}</h3>
      <LinkButtonIconOnly icon={mdiEye} href={p.file.url} variant={buttonVariant.ghost} newTab title={ttc("View")} />
      <ButtonIconOnly
        icon={mdiDownload}
        variant={buttonVariant.ghost}
        title={ttc("Download")}
        onClick={(e) => {
          e.preventDefault()
          downloadFileByUrl(p.file.url, p.file.displayName)
        }}
      />
      <ClipboardCopyButtonIconOnly
        variant={buttonVariant.ghost}
        data={p.file.url}
        copyText={ttc("Copy URL to clipboard")}
        toastText={ttc("URL copied")}
      />

      <Show when={p.mode !== formMode.view}>
        <>
          <LinkButtonIconOnly
            icon={formModeIcon.edit}
            href={urlFileEdit(p.resourceId, p.file.fileId)}
            variant={buttonVariant.ghost}
            title={getFormModeTitle(formMode.edit, "File")}
          />
          <LinkButtonIconOnly
            icon={formModeIcon.remove}
            href={urlFileRemove(p.resourceId, p.file.fileId)}
            variant={buttonVariant.ghost}
            title={getFormModeTitle(formMode.remove, "File")}
          />
        </>
      </Show>
    </article>
  )
}
