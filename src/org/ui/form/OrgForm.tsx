import type { OrgFormStateManagement } from "@/org/ui/form/orgCreateFormStateManagement"
import { orgFormField } from "@/org/ui/form/orgFormField"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, getFormTitle, type FormMode } from "~ui/input/form/formMode"
import { getFormIcon } from "~ui/input/form/getFormIcon"
import { InputS } from "~ui/input/input/InputS"
import { inputMaxLength25, inputMaxLength50, urlMaxLength } from "~ui/input/input/inputMaxLength"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { TextareaS } from "~ui/input/textarea/TextareaS"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"

interface HasOrgFormStateManagement {
  sm: OrgFormStateManagement
}

export interface OrgContentProps extends MayHaveClass, HasOrgFormStateManagement {
  mode: FormMode
}

export function OrgForm(p: OrgContentProps) {
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <h1 class="text-2xl font-bold mt-6 mb-2">{getOrgTitle(p.mode)}</h1>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <NameField sm={p.sm} />
        {p.mode === formMode.add && <HandleField sm={p.sm} />}
        <DescriptionField sm={p.sm} />
        <UrlField sm={p.sm} />
        <ImageField sm={p.sm} />
        <ButtonIcon
          type="submit"
          disabled={p.sm.isSaving.get()}
          icon={getFormIcon(p.mode)}
          variant={p.sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
          class="w-full"
        >
          {p.sm.isSaving.get() ? "Saving..." : getOrgTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function NameField(p: HasOrgFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={orgFormField.name}>
        {ttt("Name")}
        <LabelAsterix />
      </Label>
      <InputS
        id={orgFormField.name}
        placeholder={ttt("Enter organization name")}
        autocomplete="organization-title"
        valueSignal={p.sm.state.name}
        onInput={(e) => {
          p.sm.state.name.set(e.currentTarget.value)
          p.sm.validateOnChange(orgFormField.name)(e.currentTarget.value)
        }}
        onBlur={(e) => p.sm.validateOnChange(orgFormField.name)(e.currentTarget.value)}
        class={classMerge("w-full", p.sm.errors.name.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={inputMaxLength50}
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
      <Label for={orgFormField.orgHandle}>
        {ttt("Organization Handle")}
        <LabelAsterix />
      </Label>
      <InputS
        id={orgFormField.orgHandle}
        placeholder={ttt("your-company-name")}
        autocomplete="organization"
        valueSignal={p.sm.state.orgHandle}
        onInput={(e) => {
          p.sm.state.orgHandle.set(e.currentTarget.value)
          p.sm.validateOnChange(orgFormField.orgHandle)(e.currentTarget.value)
        }}
        onBlur={(e) => p.sm.validateOnChange(orgFormField.orgHandle)(e.currentTarget.value)}
        class={classMerge("w-full", p.sm.errors.orgHandle.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={inputMaxLength25}
      />
      <Show when={p.sm.errors.orgHandle.get()}>
        <p class="text-destructive">{p.sm.errors.orgHandle.get()}</p>
      </Show>
    </div>
  )
}

function DescriptionField(p: HasOrgFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={orgFormField.description}>Description</Label>
      <TextareaS
        id={orgFormField.description}
        placeholder={ttt("Enter organization description")}
        valueSignal={p.sm.state.description}
        onInput={(e) => {
          p.sm.state.description.set(e.currentTarget.value)
          p.sm.validateOnChange(orgFormField.description)(e.currentTarget.value)
        }}
        onBlur={(e) => p.sm.validateOnChange(orgFormField.description)(e.currentTarget.value)}
        class={classMerge(
          "w-full",
          p.sm.errors.description.get() && "border-destructive focus-visible:ring-destructive",
        )}
        maxLength={urlMaxLength}
      />
      <Show when={p.sm.errors.description.get()}>
        <p class="text-destructive">{p.sm.errors.description.get()}</p>
      </Show>
    </div>
  )
}

function UrlField(p: HasOrgFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={orgFormField.url}>URL</Label>
      <InputS
        id={orgFormField.url}
        type="url"
        placeholder={ttt("Enter organization URL")}
        autocomplete="url"
        valueSignal={p.sm.state.url}
        onInput={(e) => {
          p.sm.state.url.set(e.currentTarget.value)
          p.sm.validateOnChange(orgFormField.url)(e.currentTarget.value)
        }}
        onBlur={(e) => p.sm.validateOnChange(orgFormField.url)(e.currentTarget.value)}
        class={classMerge("w-full", p.sm.errors.url.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={urlMaxLength}
      />
      <Show when={p.sm.errors.url.get()}>
        <p class="text-destructive">{p.sm.errors.url.get()}</p>
      </Show>
    </div>
  )
}

function ImageField(p: HasOrgFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <Label for={orgFormField.image}>{ttt("Image URL")}</Label>
      <InputS
        id={orgFormField.image}
        type="url"
        placeholder={ttt("Enter image URL")}
        autocomplete="url"
        valueSignal={p.sm.state.image}
        onInput={(e) => {
          p.sm.state.image.set(e.currentTarget.value)
          p.sm.validateOnChange(orgFormField.image)(e.currentTarget.value)
        }}
        onBlur={(e) => p.sm.validateOnChange(orgFormField.image)(e.currentTarget.value)}
        class={classMerge("w-full", p.sm.errors.image.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={urlMaxLength}
      />
      <Show when={p.sm.errors.image.get()}>
        <p class="text-destructive">{p.sm.errors.image.get()}</p>
      </Show>
    </div>
  )
}

function getOrgTitle(mode: FormMode): string {
  return getFormTitle(mode, ttt("Organization"))
}
