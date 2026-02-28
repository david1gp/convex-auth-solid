import { language } from "@/app/i18n/language"
import { languageGetText } from "@/app/i18n/languageGetText"
import { ttc } from "@/app/i18n/ttc"
import { addKeyboardListenerAlt } from "@/auth/ui/sign_up/form/addKeyboardListenerAlt"
import type { HasFileId } from "@/file/model_field/HasFileId"
import { fileFormConfig, fileFormField } from "@/file/ui/form/fileFormField"
import { type FileFormStateManagement, type FormModeEditOrDelete } from "@/file/ui/form/fileFormStateManagement"
import { urlFileRemove } from "@/file/url/urlFile"
import type { HasResourceId } from "@/resource/model/HasResourceId"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { isDevEnv } from "@/utils/env/isDevEnv"
import { Show } from "solid-js"
import { CheckSingle } from "~ui/input/check/CheckSingle"
import { formMode, getFormModeTitle, type FormMode } from "~ui/input/form/formMode"
import { formModeIcon } from "~ui/input/form/formModeIcon"
import { LabelPseudo } from "~ui/input/label/LabelPseudo"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"

interface HasFileFormStateManagement {
  sm: FileFormStateManagement
}

export interface FileFormProps extends HasResourceId, HasFileId, HasFileFormStateManagement, MayHaveClass {
  mode: FormModeEditOrDelete
}

export function FileForm(p: FileFormProps) {
  if (isDevEnv()) {
    addKeyboardListenerAlt("t", p.sm.fillTestData)
  }
  return (
    <section class={classMerge("px-2 sm:px-4 pb-10", "text-gray-900 dark:text-gray-100", p.class)}>
      <div class="flex flex-wrap justify-between mt-6 mb-2">
        <h1 class="text-2xl font-bold">{getFileTitle(p.mode)}</h1>
        {p.mode === formMode.edit && (
          <LinkButton
            href={urlFileRemove(p.resourceId, p.fileId)}
            icon={formModeIcon.remove}
            variant={buttonVariant.link}
          >
            {ttc("Remove")}
          </LinkButton>
        )}
      </div>
      <form class="space-y-4" onSubmit={p.sm.handleSubmit}>
        <FileNameField sm={p.sm} />
        <LanguageField sm={p.sm} />
        <ButtonIcon
          type="submit"
          isLoading={p.sm.isSubmitting.get()}
          icon={formModeIcon[p.mode]}
          variant={p.mode === formMode.remove || p.sm.hasErrors() ? buttonVariant.destructive : buttonVariant.primary}
          class="w-full"
        >
          {p.sm.isSubmitting.get() ? ttc("Saving...") : getFileTitle(p.mode)}
        </ButtonIcon>
      </form>
    </section>
  )
}

function FileNameField(p: HasFileFormStateManagement) {
  return (
    <FormFieldInput
      config={fileFormConfig.displayName}
      value={p.sm.state.displayName.get()}
      error={p.sm.errors.displayName.get()}
      mode={p.sm.mode}
      onInput={(value) => {
        p.sm.state.displayName.set(value)
        p.sm.validateOnChange(fileFormField.displayName)(value)
      }}
      onBlur={(value) => p.sm.validateOnChange(fileFormField.displayName)(value)}
    />
  )
}

function LanguageField(p: HasFileFormStateManagement) {
  return (
    <div class="flex flex-col gap-2">
      <LabelPseudo>{ttc("Language")}</LabelPseudo>
      <CheckSingle
        valueSignal={p.sm.state.language}
        getOptions={() => Object.values(language)}
        valueText={languageGetText}
        disabled={p.sm.mode === formMode.remove}
        innerClass="flex flex-wrap gap-2"
        optionClass="bg-gray-50"
      />
      <Show when={p.sm.errors.language.get()}>
        <p class="text-destructive">{p.sm.errors.language.get()}</p>
      </Show>
    </div>
  )
}

function getFileTitle(mode: FormMode): string {
  return getFormModeTitle(mode, ttc("File"))
}
