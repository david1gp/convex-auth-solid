import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { workspaceFormField, type WorkspaceFormStateManagement } from "@/workspace/ui/form/workspaceFormStateManagement"
import { urlWorkspaceRemove } from "@/workspace/url/urlWorkspace"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, formModeIsReadOnly, getFormModeTitle, type FormMode } from "~ui/input/form/formMode"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { Input } from "~ui/input/input/Input"
import { inputMaxLength50, urlMaxLength } from "~ui/input/input/inputMaxLength"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { Textarea } from "~ui/input/textarea/Textarea"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"

interface HasOrgFormStateManagement {
  sm: WorkspaceFormStateManagement
}

export interface WorkspaceContentProps extends MayHaveClass, HasOrgFormStateManagement {
  workspaceHandle?: string
  mode: FormMode
}

export function WorkspaceForm(p: WorkspaceContentProps) {
  if (isDevEnvVite()) {
    addKeyboardListenerAlt("t", p.sm.fillTestData)
  }
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <div class="flex flex-wrap justify-between mt-6 mb-2">
        <h1 class="text-2xl font-bold">{getWorkspaceTitle(p.mode)}</h1>
        {p.mode === formMode.edit && (
          <LinkButton
            icon={formModeIcon.remove}
            href={urlWorkspaceRemove(p.workspaceHandle ?? "missing")}
            variant={buttonVariant.link}
          >
            {ttt("Remove")}
          </LinkButton>
        )}
      </div>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <NameField sm={p.sm} />
        {p.mode === formMode.add && <HandleField sm={p.sm} />}
        <DescriptionField sm={p.sm} />
        <ImageField sm={p.sm} />
        <UrlField sm={p.sm} />
        <ButtonIcon
          type="submit"
          disabled={p.sm.isSaving.get()}
          icon={formModeIcon[p.mode]}
          variant={p.mode === formMode.remove || p.sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
          class="w-full"
        >
          {p.sm.isSaving.get() ? ttt("Saving...") : getWorkspaceTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function NameField(p: HasOrgFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={workspaceFormField.name}>
        {ttt("Name")} <LabelAsterix />
      </Label>
      <Input
        id={workspaceFormField.name}
        placeholder={ttt("Enter workspace name")}
        autocomplete="organization"
        value={p.sm.state.name.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.name.set(value)
          p.sm.validateOnChange(workspaceFormField.name)(value)
        }}
        onBlur={(e) => p.sm.validateOnChange(workspaceFormField.name)(e.currentTarget.value)}
        class={classMerge("w-full", p.sm.errors.name.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={inputMaxLength50}
        disabled={p.sm.mode === formMode.remove}
        readOnly={formModeIsReadOnly(p.sm.mode)}
      />
      <Show when={p.sm.errors.name.get()}>
        <p class="text-destructive">{p.sm.errors.name.get()}</p>
      </Show>
    </div>
  )
}

function HandleField(p: HasOrgFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={workspaceFormField.workspaceHandle}>
        {ttt("Handle")} <LabelAsterix />
      </Label>
      <Input
        id={workspaceFormField.workspaceHandle}
        placeholder={ttt("Enter workspace handle")}
        autocomplete="organization-title"
        value={p.sm.state.workspaceHandle.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.workspaceHandle.set(value)
          p.sm.validateOnChange(workspaceFormField.workspaceHandle)(value)
        }}
        onBlur={(e) => p.sm.validateOnChange(workspaceFormField.workspaceHandle)(e.currentTarget.value)}
        class={classMerge(
          "w-full",
          p.sm.errors.workspaceHandle.get() && "border-destructive focus-visible:ring-destructive",
        )}
        maxLength={inputMaxLength50}
        disabled={p.sm.mode === formMode.remove}
        readOnly={formModeIsReadOnly(p.sm.mode)}
      />
      <Show when={p.sm.errors.workspaceHandle.get()}>
        <p class="text-destructive">{p.sm.errors.workspaceHandle.get()}</p>
      </Show>
    </div>
  )
}

function DescriptionField(p: HasOrgFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={workspaceFormField.description}>{ttt("Description")}</Label>
      <Textarea
        id={workspaceFormField.description}
        placeholder={ttt("Enter workspace description")}
        value={p.sm.state.description.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.description.set(value)
          p.sm.validateOnChange(workspaceFormField.description)(value)
        }}
        onBlur={(e) => p.sm.validateOnChange(workspaceFormField.description)(e.currentTarget.value)}
        class={classMerge(
          "w-full",
          p.sm.errors.description.get() && "border-destructive focus-visible:ring-destructive",
        )}
        maxLength={urlMaxLength}
        disabled={p.sm.mode === formMode.remove}
        readOnly={formModeIsReadOnly(p.sm.mode)}
      />
      <Show when={p.sm.errors.description.get()}>
        <p class="text-destructive">{p.sm.errors.description.get()}</p>
      </Show>
    </div>
  )
}

function ImageField(p: HasOrgFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={workspaceFormField.image}>{ttt("Image URL")}</Label>
      <Input
        id={workspaceFormField.image}
        type="url"
        placeholder={ttt("Enter image URL")}
        autocomplete="url"
        value={p.sm.state.image.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.image.set(value)
          p.sm.validateOnChange(workspaceFormField.image)(value)
        }}
        onBlur={(e) => p.sm.validateOnChange(workspaceFormField.image)(e.currentTarget.value)}
        class={classMerge("w-full", p.sm.errors.image.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={urlMaxLength}
        disabled={p.sm.mode === formMode.remove}
        readOnly={formModeIsReadOnly(p.sm.mode)}
      />
      <Show when={p.sm.errors.image.get()}>
        <p class="text-destructive">{p.sm.errors.image.get()}</p>
      </Show>
    </div>
  )
}

function UrlField(p: HasOrgFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={workspaceFormField.url}>{ttt("Website URL")}</Label>
      <Input
        id={workspaceFormField.url}
        type="url"
        placeholder={ttt("Enter website URL")}
        autocomplete="url"
        value={p.sm.state.url.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.url.set(value)
          p.sm.validateOnChange(workspaceFormField.url)(value)
        }}
        onBlur={(e) => p.sm.validateOnChange(workspaceFormField.url)(e.currentTarget.value)}
        class={classMerge("w-full", p.sm.errors.url.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={urlMaxLength}
        disabled={p.sm.mode === formMode.remove}
        readOnly={formModeIsReadOnly(p.sm.mode)}
      />
      <Show when={p.sm.errors.url.get()}>
        <p class="text-destructive">{p.sm.errors.url.get()}</p>
      </Show>
    </div>
  )
}

function getWorkspaceTitle(mode: FormMode): string {
  return getFormModeTitle(mode, ttt("Workspace"))
}
