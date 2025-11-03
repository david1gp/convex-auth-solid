import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrg } from "@/org/org_convex/IdOrg"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import styles from "@/ui/loaders/AnimateFadeIn.module.css"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { createEffect, Match, Switch, type JSXElement } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { ResultErr, ResultOk } from "~utils/result/Result"

export interface OrgLoaderProps extends HasOrgHandle, MayHaveClass {
  OrgComponent: (p: OrgComponentProps) => JSXElement
}

export interface OrgComponentProps extends MayHaveClass {
  org: DocOrg
}

export function OrgLoader(p: OrgLoaderProps) {
  const getData = createQuery(api.org.orgGetQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
  })
  createEffect(() => {
    console.log("OrgLoader", getData())
  })
  return (
    <Switch>
      <Match when={!getData()}>
        <OrgLoading />
      </Match>
      <Match when={!getData()!.success}>
        <ErrorPage
          title={(getData()! as ResultErr).errorMessage || "Error loading organization"}
          class={styles.animateFadeIn2s}
        />
      </Match>
      <Match when={true}>{p.OrgComponent({ org: (getData() as ResultOk<DocOrg>).data, class: p.class })}</Match>
    </Switch>
  )
}

function OrgLoading() {
  return <LoadingSection loadingSubject={ttt("Organization")} class={styles.animateFadeIn2s} />
}
