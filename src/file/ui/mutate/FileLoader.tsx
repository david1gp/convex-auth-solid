import { ttc } from "#src/app/i18n/ttc.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { FileModel } from "#src/file/model/FileModel.js"
import { fileSchema } from "#src/file/model/fileSchema.js"
import type { HasFileModel } from "#src/file/model/HasFileModel.js"
import type { HasFileId } from "#src/file/model_field/HasFileId.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { LoadingSection } from "#src/ui/pages/LoadingSection.js"
import { createQueryCached } from "#src/utils/cache/createQueryCached.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { resultHasData } from "#src/utils/result/resultHasData.js"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import { api } from "@convex/_generated/api.js"
import { Match, Switch, type JSXElement } from "solid-js"
import * as a from "valibot"

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
