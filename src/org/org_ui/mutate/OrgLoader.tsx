import { ttc } from "#src/app/i18n/ttc.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { HasOrgModel } from "#src/org/org_model/HasOrgModel.js"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { LoadingSection } from "#src/ui/pages/LoadingSection.js"
import { createQueryCached } from "#src/utils/cache/createQueryCached.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { resultHasData } from "#src/utils/result/resultHasData.js"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import { api } from "@convex/_generated/api.js"
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
