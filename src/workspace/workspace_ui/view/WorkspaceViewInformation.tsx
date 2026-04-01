import { ttc } from "#src/app/i18n/ttc.ts"
import { Ps } from "#src/ui/text/Ps.tsx"
import type { WorkspaceModel } from "#src/workspace/workspace_model/WorkspaceModel.ts"
import { workspacePageSection } from "#src/workspace/workspace_ui/view/workspacePageSection.tsx"
import { urlWorkspaceEdit } from "#src/workspace/workspace_url/urlWorkspace.ts"
import { formModeIcon } from "#ui/input/form/formModeIcon.ts"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { Img } from "#ui/static/img/Img.tsx"
import { classArr } from "#ui/utils/classArr.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { mdiHandWave } from "@mdi/js"
import { Show } from "solid-js"

export interface WorkspaceViewProps extends MayHaveClass {
  workspace: WorkspaceModel
  showEditButton: boolean
}

export function WorkspaceViewInformation(p: WorkspaceViewProps) {
  return (
    <section id={workspacePageSection.workspace} class="text-center">
      <ShowImg {...p} />
      <h1 class="text-5xl font-bold mb-6 text-balance">{p.workspace.name}</h1>
      <ShowSubtitle {...p} />
      <ShowUrl {...p} />
      {p.showEditButton && (
        <LinkButton
          href={urlWorkspaceEdit(p.workspace.workspaceHandle)}
          variant={buttonVariant.ghost}
          icon={formModeIcon.edit}
          class="flex mt-4"
        >
          {ttc("Edit")}
        </LinkButton>
      )}
    </section>
  )
}

function ShowImg(p: WorkspaceViewProps) {
  return (
    <Show when={p.workspace.image} fallback={<ImageFallBack />}>
      {(getImageUrl) => (
        <Img
          src={getImageUrl()}
          alt={ttc("Logo of ") + " " + p.workspace.name}
          class={classArr("h-40 rounded-xl mx-auto mb-6")}
        />
      )}
    </Show>
  )
}

function ImageFallBack() {
  return (
    <Icon
      path={mdiHandWave}
      class={classArr(
        " mx-auto",
        "size-40",
        "p-6",
        "fill-white text-white bg-blue-400",
        "rounded-4xl",
        "shadow-lg hover:shadow-xl",
      )}
    />
  )
}

function ShowSubtitle(p: WorkspaceViewProps) {
  return (
    <Show when={p.workspace.description}>
      {(getSubtitle) => (
        <div class="text-lg mx-auto text-pretty mb-4">
          <Ps text={getSubtitle()} />
        </div>
      )}
    </Show>
  )
}

function ShowUrl(p: WorkspaceViewProps) {
  return (
    <Show when={p.workspace.url}>
      {(getUrl) => (
        <a
          href={getUrl()}
          class={classArr(
            "text-lg font-semibold",
            "text-black dark:text-white",
            "underline decoration-2 underline-offset-4",
          )}
        >
          {getUrl()}
        </a>
      )}
    </Show>
  )
}
