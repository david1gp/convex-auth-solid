import { api } from "#convex/_generated/api.js"
import type { ResultErr, ResultOk } from "#result"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import styles from "#src/ui/loaders/AnimateFadeIn.module.css"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import type { DocWorkspace } from "#src/workspace/convex/IdWorkspace.ts"
import type { HasWorkspaceHandle } from "#src/workspace/model/HasWorkspaceHandle.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { Match, Switch, type JSXElement } from "solid-js"

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
