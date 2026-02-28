import { ttc } from "@/app/i18n/ttc"
import { appTabIcon } from "@/app/tabs/appTab"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { FileModel } from "@/file/model/FileModel"
import { fileSchema } from "@/file/model/fileSchema"
import { FileCardEdit } from "@/file/ui/list/FileCardEdit"
import { urlFileUpload } from "@/file/url/urlFile"
import type { HasResourceId } from "@/resource/model/HasResourceId"
import { SectionHeader } from "@/ui/header/SectionHeader"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex_client/createQuery"
import { resultHasErrorMessage } from "@/utils/result/resultHasErrorMessage"
import { resultHasList } from "@/utils/result/resultHasList"
import { api } from "@convex/_generated/api"
import { For, Match, Show, Switch } from "solid-js"
import * as a from "valibot"
import { formMode, type HasFormMode } from "~ui/input/form/formMode"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButtonIconOnly } from "~ui/interactive/link/LinkButtonIconOnly"
import { classesGridCols2xl } from "~ui/static/container/classesGridCols"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
