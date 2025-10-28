import type { WorkspaceFormStateManagement } from "@/workspace/ui/form/workspaceCreateFormStateManagement"
import { ttt } from "~ui/i18n/ttt"
import { getFormTitle, type FormMode } from "~ui/input/form/formMode"
import { getFormIcon } from "~ui/input/form/getFormIcon"
import { InputS } from "~ui/input/input/InputS"
import { TextareaS } from "~ui/input/textarea/TextareaS"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface WorkspaceContentProps extends MayHaveClass {
  mode: FormMode
  sm: WorkspaceFormStateManagement
}

export function WorkspaceForm(p: WorkspaceContentProps) {
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <h1 class="text-2xl font-bold mt-6 mb-2">{getWorkspaceTitle(p.mode)}</h1>
      <form class="flex flex-col gap-6" onSubmit={p.sm.handleSubmit}>
        <InputS id="name" placeholder="Name" valueSignal={p.sm.state.name} class="w-full" />
        <InputS id="slug" placeholder="Slug" valueSignal={p.sm.state.slug} class="w-full" />
        <TextareaS
          id="prompt"
          placeholder="Description (optional)"
          valueSignal={p.sm.state.description}
          class="w-full"
        />
        <InputS id="image" placeholder="Image (optional)" valueSignal={p.sm.state.image} class="w-full" />
        <ButtonIcon type="submit" disabled={p.sm.isSaving.get()} icon={getFormIcon(p.mode)}>
          {p.sm.isSaving.get() ? "Saving..." : getWorkspaceTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function getWorkspaceTitle(mode: FormMode): string {
  return getFormTitle(mode, ttt("Workspace"))
}
