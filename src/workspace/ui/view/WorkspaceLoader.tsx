import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import styles from "@/ui/loaders/AnimateFadeIn.module.css"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQuery } from "@/utils/convex_client/createQuery"
import type { DocWorkspace } from "@/workspace/convex/IdWorkspace"
import type { HasWorkspaceHandle } from "@/workspace/model/HasWorkspaceHandle"
import { api } from "@convex/_generated/api"
import { Match, Switch, type JSXElement } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { ResultErr, ResultOk } from "~utils/result/Result"

export interface WorkspaceLoaderProps extends HasWorkspaceHandle, MayHaveClass {
  WorkspaceComponent: (p: WorkspaceComponentProps) => JSXElement
}

export interface WorkspaceComponentProps extends MayHaveClass {
  workspace: DocWorkspace
}

export function WorkspaceLoader(p: WorkspaceLoaderProps) {
  const getData = createQuery(api.workspace.workspaceGetQuery, {
    token: userTokenGet(),
    workspaceHandle: p.workspaceHandle,
  })
  return (
    <Switch>
      <Match when={!getData()}>
        <WorkspaceLoading />
      </Match>
      <Match when={!getData()!.success}>
        <ErrorPage title={(getData()! as ResultErr).errorMessage || "Error loading workspace"} />
      </Match>
      <Match when={true}>
        {p.WorkspaceComponent({ workspace: (getData() as ResultOk<DocWorkspace>).data, class: p.class })}
      </Match>
    </Switch>
  )
}

function WorkspaceLoading() {
  return <LoadingSection loadingSubject={ttt("Workspace")} class={styles.animateFadeIn2s} />
}
