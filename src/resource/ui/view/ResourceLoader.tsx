import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { FileModel } from "#src/file/model/FileModel.js"
import type { HasResourceId } from "#src/resource/model/HasResourceId.js"
import type { HasResourceModel } from "#src/resource/model/HasResourceModel.js"
import type { ResourceFilesModel } from "#src/resource/model/ResourceFilesModel.js"
import { resourceFilesSchema } from "#src/resource/model/ResourceFilesModel.js"
import type { ResourceModel } from "#src/resource/model/ResourceModel.js"
import { resourceNameSet } from "#src/resource/ui/resourceNameRecordSignal.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { LoadingSection } from "#src/ui/pages/LoadingSection.js"
import { createQueryCached } from "#src/utils/cache/createQueryCached.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import { api } from "@convex/_generated/api.js"
import { createEffect, Match, Switch, type JSXElement } from "solid-js"
import * as a from "valibot"

export interface ResourceLoaderProps extends HasResourceId, MayHaveClass {
  ResourceComponent: (p: ResourceComponentProps) => JSXElement
}

export interface ResourceComponentProps extends HasResourceModel, MayHaveClass {
  files?: FileModel[]
}

export function ResourceLoader(p: ResourceLoaderProps) {
  const getDataQuery = createQuery(api.resource.resourceFilesGetQuery, {
    token: userTokenGet(),
    resourceId: p.resourceId,
  })
  const getData = createQueryCached<ResourceFilesModel | null>(
    getDataQuery,
    "resourceFilesGetQuery" + "/" + p.resourceId,
    a.union([resourceFilesSchema, a.null()]),
  )
  createEffect(() => {
    const got = getData()
    if (!got) return
    if (!got.success) return
    const data = got.data
    if (!data) return
    const name = data.resource.name
    if (!name) return
    resourceNameSet(p.resourceId, name)
  })
  return (
    <Switch>
      <Match when={!getData()}>
        <ResourceLoading />
      </Match>
      <Match when={resultHasErrorMessage(getData())}>
        {(getErrorMessage) => <ErrorPage title={getErrorMessage()} />}
      </Match>
      <Match when={hasData(getData())}>
        {(getLoadedData) =>
          p.ResourceComponent({ resource: getLoadedData().resource, files: getLoadedData().files, class: p.class })
        }
      </Match>
    </Switch>
  )
}

type LoadedDataOrNull = {
  resource: ResourceModel
  files: FileModel[]
} | null

function hasData(data: Result<ResourceFilesModel | null> | undefined): LoadedDataOrNull {
  if (!data) return null
  if (!data.success) return null
  if (!data.data) return null
  return { resource: data.data.resource, files: data.data.files }
}

function ResourceLoading() {
  return <LoadingSection loadingSubject={ttc("Resource")} />
}
