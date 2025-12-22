import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { HasOrgModel } from "@/org/org_model/HasOrgModel"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex/createQuery"
import { resultHasData } from "@/utils/result/resultHasData"
import { resultHasErrorMessage } from "@/utils/result/resultHasErrorMessage"
import { api } from "@convex/_generated/api"
import { createEffect, Match, Switch, type JSXElement } from "solid-js"
import * as a from "valibot"
import { ttt } from "~ui/i18n/ttt"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

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
  return <LoadingSection loadingSubject={ttt("Organization")} />
}
