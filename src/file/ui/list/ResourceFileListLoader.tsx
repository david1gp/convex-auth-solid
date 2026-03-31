import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { appTabIcon } from "#src/app/tabs/appTab.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { FileModel } from "#src/file/model/FileModel.ts"
import { fileSchema } from "#src/file/model/fileSchema.ts"
import { FileCardEdit } from "#src/file/ui/list/FileCardEdit.tsx"
import { urlFileUpload } from "#src/file/url/urlFile.ts"
import type { HasResourceId } from "#src/resource/model/HasResourceId.ts"
import { SectionHeader } from "#src/ui/header/SectionHeader.tsx"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import { resultHasList } from "#src/utils/result/resultHasList.ts"
import { formMode, type HasFormMode } from "#ui/input/form/formMode.ts"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonIconOnly } from "#ui/interactive/link/LinkButtonIconOnly.jsx"
import { classesGridCols2xl } from "#ui/static/grid/classesGridCols.ts"
import { classArr } from "#ui/utils/classArr.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { For, Match, Show, Switch } from "solid-js"
import * as a from "valibot"

export interface ResourceFileListProps extends HasResourceId, HasFormMode, MayHaveClass {}

export function ResourceFileListLoader(p: ResourceFileListProps) {
  const getFilesResult = createQueryCached<FileModel[]>(
    createQuery(api.resource.resourceFileListQuery, {
      token: userTokenGet(),
      resourceId: p.resourceId,
    }),
    "resourceFileListQuery" + "/" + p.resourceId,
    a.array(fileSchema),
  )

  return (
    <section class="contents">
      <Show when={p.mode === formMode.view}>
        <SectionHeader
          title={ttc("Files")}
          href={urlFileUpload(p.resourceId)}
          icon={appTabIcon.resource}
          class="mt-4 mb-1"
        >
          <LinkButtonIconOnly
            icon={formModeIcon.edit}
            href={urlFileUpload(p.resourceId)}
            variant={buttonVariant.ghost}
            title={ttc("Manage")}
            class="hover:bg-gray-200"
          ></LinkButtonIconOnly>
        </SectionHeader>
      </Show>

      <Switch fallback={<ErrorPage title={ttc("Missing Switch")} />}>
        <Match when={getFilesResult() === undefined}>
          <ResourceFileListIsLoading />
        </Match>
        <Match when={resultHasErrorMessage(getFilesResult())}>
          {(getErrorMessage) => <ErrorPage title={getErrorMessage()} />}
        </Match>
        <Match when={!resultHasList(getFilesResult())}>
          <NoFiles
            class={p.mode === formMode.add ? "text-center" : undefined}
            text={p.mode === formMode.add ? ttc("No uploaded files yet") : undefined}
          />
        </Match>
        <Match when={resultHasList(getFilesResult())}>
          {(getList) => <FileList mode={p.mode} resourceId={p.resourceId} files={getList()} />}
        </Match>
      </Switch>
    </section>
  )
}

function ResourceFileListIsLoading() {
  return <LoadingSection loadingSubject={ttc("Resource files")} />
}

interface NoFilesProps extends MayHaveClass {
  text?: string
}

function NoFiles(p: NoFilesProps) {
  return <p class={classArr("text-muted-foreground", p.class)}>{p.text ?? ttc("No files yet")}</p>
}

interface FileListProps extends HasFormMode, HasResourceId {
  files: FileModel[]
}

function FileList(p: FileListProps) {
  return (
    <div class={classArr(p.files.length >= 2 && classesGridCols2xl, "gap-4")}>
      <For each={p.files}>{(r) => <FileCardEdit resourceId={p.resourceId} file={r} />}</For>
    </div>
  )
}
