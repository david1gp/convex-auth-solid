import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import { orgFormField } from "@/org/org_ui/form/orgFormField"
import type { OrgFormStateManagement } from "@/org/org_ui/form/orgFormStateManagement"
import { isDevEnvVite } from "@/utils/ui/isDevEnvVite"
import { inputMaxLength50, urlMaxLength } from "@/utils/valibot/inputMaxLength"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, formModeIsReadOnly, getFormModeTitle, type FormMode } from "~ui/input/form/formMode"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { Input } from "~ui/input/input/Input"
import { Label } from "~ui/input/label/Label"
import { LabelAsterix } from "~ui/input/label/LabelAsterix"
import { Textarea } from "~ui/input/textarea/Textarea"
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
  if (isDevEnvVite()) {
    addKeyboardListenerAlt("t", p.sm.fillTestData)
  }
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
          icon={formModeIcon[p.mode]}
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
      <Input
        id={orgFormField.name}
        placeholder={ttt("Enter organization name, ex. ACME")}
        autocomplete="organization-title"
        value={p.sm.state.name.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.name.set(value)
          p.sm.validateOnChange(orgFormField.name)(value)
        }}
        class={classMerge("w-full", p.sm.errors.name.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={inputMaxLength50}
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
      <Label for={orgFormField.orgHandle}>
        {ttt("Organization Handle")}
        <LabelAsterix />
      </Label>
      <Input
        id={orgFormField.orgHandle}
        placeholder={ttt("A unique identifier, visible in the url, ex. your-company-name")}
        autocomplete="organization"
        value={p.sm.state.orgHandle.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.orgHandle.set(value)
          p.sm.validateOnChange(orgFormField.orgHandle)(value)
        }}
        class={classMerge("w-full", p.sm.errors.orgHandle.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={inputMaxLength50}
        readOnly={formModeIsReadOnly(p.sm.mode)}
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
      <Textarea
        id={orgFormField.description}
        placeholder={ttt("A brief description of your organization")}
        value={p.sm.state.description.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.description.set(value)
          p.sm.validateOnChange(orgFormField.description)(value)
        }}
        class={classMerge(
          "w-full",
          "min-h-[3lh] h-[7lh]",
          p.sm.errors.description.get() && "border-destructive focus-visible:ring-destructive",
        )}
        maxLength={urlMaxLength}
        readOnly={formModeIsReadOnly(p.sm.mode)}
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
      <Input
        id={orgFormField.url}
        type="url"
        placeholder={ttt("An optional external URL shown on Organization page")}
        autocomplete="url"
        value={p.sm.state.url.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.url.set(value)
          p.sm.validateOnChange(orgFormField.url)(value)
        }}
        class={classMerge("w-full", p.sm.errors.url.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={urlMaxLength}
        readOnly={formModeIsReadOnly(p.sm.mode)}
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
      <Input
        id={orgFormField.image}
        type="url"
        placeholder={ttt("An optional URL to your organization's logo or image")}
        autocomplete="url"
        value={p.sm.state.image.get()}
        onInput={(e) => {
          const value = e.currentTarget.value
          p.sm.state.image.set(value)
          p.sm.validateOnChange(orgFormField.image)(value)
        }}
        class={classMerge("w-full", p.sm.errors.image.get() && "border-destructive focus-visible:ring-destructive")}
        maxLength={urlMaxLength}
        readOnly={formModeIsReadOnly(p.sm.mode)}
      />
      <Show when={p.sm.errors.image.get()}>
        <p class="text-destructive">{p.sm.errors.image.get()}</p>
      </Show>
    </div>
  )
}

function getOrgTitle(mode: FormMode): string {
  return getFormModeTitle(mode, ttt("Organization"))
}
