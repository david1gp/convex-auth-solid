import { ttc } from "@/app/i18n/ttc"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { FileModel } from "@/file/model/FileModel"
import type { HasResourceId } from "@/resource/model/HasResourceId"
import type { HasResourceModel } from "@/resource/model/HasResourceModel"
import type { ResourceFilesModel } from "@/resource/model/ResourceFilesModel"
import { resourceFilesSchema } from "@/resource/model/ResourceFilesModel"
import type { ResourceModel } from "@/resource/model/ResourceModel"
import { resourceNameSet } from "@/resource/ui/resourceNameRecordSignal"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex_client/createQuery"
import { resultHasErrorMessage } from "@/utils/result/resultHasErrorMessage"
import { api } from "@convex/_generated/api"
import { createEffect, Match, Switch, type JSXElement } from "solid-js"
import * as a from "valibot"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { Result } from "~utils/result/Result"

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
