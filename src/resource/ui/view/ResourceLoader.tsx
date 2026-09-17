import { createEffect, type JSXElement, Match, Switch } from "solid-js"
import * as a from "valibot"
import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { ttc } from "#src/app/i18n/ttc.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { HasResourceId } from "#src/resource/model/HasResourceId.ts"
import type { HasResourceModel } from "#src/resource/model/HasResourceModel.ts"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import { resourceSchema } from "#src/resource/model/resourceSchema.ts"
import { resourceNameSet } from "#src/resource/ui/resourceNameRecordSignal.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import { queryCreate } from "#src/utils/convex_client/queryCreate.ts"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

export interface ResourceLoaderProps extends HasResourceId, MayHaveClass {
  ResourceComponent: (p: ResourceComponentProps) => JSXElement
}

export interface ResourceComponentProps extends HasResourceModel, MayHaveClass {}

export function ResourceLoader(p: ResourceLoaderProps) {
  const getDataQuery = queryCreate(api.resource.resourceGetQuery, {
    token: userTokenGet(),
    resourceId: p.resourceId,
  })
  const getData = createQueryCached<ResourceModel | null>(
    getDataQuery,
    `resourceGetQuery/${p.resourceId}`,
    a.union([resourceSchema, a.null()]),
  )
  createEffect(() => {
    const got = getData()
    if (!got) return
    if (!got.success) return
    const data = got.data
    if (!data) return
    const name = data.name
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
          p.ResourceComponent({
            resource: getLoadedData(),
            class: p.class,
          })
        }
      </Match>
    </Switch>
  )
}

type LoadedDataOrNull = ResourceModel | null

function hasData(data: Result<ResourceModel | null> | undefined): LoadedDataOrNull {
  if (!data) return null
  if (!data.success) return null
  if (!data.data) return null
  return data.data
}

function ResourceLoading() {
  return <LoadingSection loadingSubject={ttc("Resource")} />
}
