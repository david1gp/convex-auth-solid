import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { HasOrgModel } from "#src/org/org_model/HasOrgModel.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import { resultHasData } from "#src/utils/result/resultHasData.ts"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { createEffect, Match, Switch, type JSXElement } from "solid-js"
import * as a from "valibot"

export interface OrgLoaderProps extends HasOrgHandle, MayHaveClass {
  OrgComponent: (p: OrgComponentProps) => JSXElement
}

export interface OrgComponentProps extends HasOrgModel, MayHaveClass {}

export function OrgLoader(p: OrgLoaderProps) {
  const getDataQuery = createQuery(api.org.orgGetQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })
  const getData = createQueryCached(getDataQuery, "orgGetQuery" + "/" + p.orgHandle, a.any())
  createEffect(() => {
    console.log("OrgLoader", getData())
  })
  return (
    <Switch>
      <Match when={!getData()}>
        <OrgLoading />
      </Match>
      <Match when={resultHasErrorMessage(getData())}>
        {(getErrorMessage) => <ErrorPage title={getErrorMessage()} />}
      </Match>
      <Match when={resultHasData(getData())}>{(gotData) => p.OrgComponent({ org: gotData(), class: p.class })}</Match>
    </Switch>
  )
}

function OrgLoading() {
  return <LoadingSection loadingSubject={ttc("Organization")} />
}
