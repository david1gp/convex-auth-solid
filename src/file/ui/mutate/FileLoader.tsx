import { ttc } from "@/app/i18n/ttc"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { FileModel } from "@/file/model/FileModel"
import { fileSchema } from "@/file/model/fileSchema"
import type { HasFileModel } from "@/file/model/HasFileModel"
import type { HasFileId } from "@/file/model_field/HasFileId"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex_client/createQuery"
import { resultHasData } from "@/utils/result/resultHasData"
import { resultHasErrorMessage } from "@/utils/result/resultHasErrorMessage"
import { api } from "@convex/_generated/api"
import { Match, Switch, type JSXElement } from "solid-js"
import * as a from "valibot"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface FileLoaderProps extends HasFileId, MayHaveClass {
  FileComponent: (p: FileComponentProps) => JSXElement
}

export interface FileComponentProps extends HasFileModel, MayHaveClass {}

export function FileLoader(p: FileLoaderProps) {
  const getDataQuery = createQuery(api.file.fileGetQuery, {
    token: userTokenGet(),
    fileId: p.fileId,
  })
  const getData = createQueryCached<FileModel | null>(
    getDataQuery,
    "fileGetQuery" + "/" + p.fileId,
    a.nullable(fileSchema),
  )
  // createEffect(() => {
  //   console.log("FileLoader", getData())
  // })
  return (
    <Switch>
      <Match when={!getData()}>
        <FileLoading />
      </Match>
      <Match when={resultHasErrorMessage(getData())}>{(errorMessage) => <ErrorPage title={errorMessage()} />}</Match>
      <Match when={resultHasData(getData())}>{(gotData) => p.FileComponent({ file: gotData(), class: p.class })}</Match>
    </Switch>
  )
}

function FileLoading() {
  return <LoadingSection loadingSubject={ttc("File")} />
}
