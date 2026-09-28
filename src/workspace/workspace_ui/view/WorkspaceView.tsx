import { For, Show } from "solid-js"
import type { WorkspaceComponentProps } from "#src/workspace/workspace_ui/view/WorkspaceLoader.tsx"
import { urlWorkspaceEdit } from "#src/workspace/workspace_url/urlWorkspace.ts"
import { ttt } from "#ui/i18n/ttt.ts"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.jsx"
import { Img } from "#ui/static/img/Img.jsx"
import { classArr } from "#ui/utils/classArr.ts"

export function WorkspaceView(p: WorkspaceComponentProps & { editHref?: string }) {
  return (
    <div class="flex flex-col gap-4">
      <Show when={p.workspace.image}>
        {(image) => (
          <Img
            src={image()}
            alt={`${ttt("Logo of ")} ${p.workspace.name}`}
            class={classArr("h-40 rounded-xl mx-auto mb-6")}
          />
        )}
      </Show>
      <div class="flex flex-wrap justify-between">
        <h1 class="text-2xl font-bold">{p.workspace.name}</h1>
        <LinkButtonInternal
          to={p.editHref ?? urlWorkspaceEdit(p.workspace.workspaceHandle)}
          variant={buttonVariant.contrast}
          icon={formModeIcon.edit}
        >
          {ttt("Edit")}
        </LinkButtonInternal>
      </div>
      <Show when={p.workspace.description}>
        {(description) => (
          <div class="text-lg mx-auto text-pretty mb-4">
            <For each={description().split("\n")}>{(line) => <p>{line}</p>}</For>
          </div>
        )}
      </Show>
      <Show when={p.workspace.url}>
        {(url) => (
          <a
            href={url()}
            class={classArr(
              "text-lg font-semibold",
              "text-black dark:text-white",
              "underline decoration-2 underline-offset-4",
            )}
          >
            {url()}
          </a>
        )}
      </Show>
    </div>
  )
}
