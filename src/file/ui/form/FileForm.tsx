import { language } from "#src/app/i18n/language.js"
import { languageGetText } from "#src/app/i18n/languageGetText.js"
import { ttc } from "#src/app/i18n/ttc.js"
import { addKeyboardListenerAlt } from "#src/auth/ui/sign_up/form/addKeyboardListenerAlt.js"
import type { HasFileId } from "#src/file/model_field/HasFileId.js"
import { fileFormConfig, fileFormField } from "#src/file/ui/form/fileFormField.js"
import { type FileFormStateManagement, type FormModeEditOrDelete } from "#src/file/ui/form/fileFormStateManagement.js"
import { urlFileRemove } from "#src/file/url/urlFile.js"
import type { HasResourceId } from "#src/resource/model/HasResourceId.js"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.jsx"
import { isDevEnv } from "#src/utils/env/isDevEnv.js"
import { CheckSingle } from "#ui/input/check/CheckSingle.jsx"
import { formMode, getFormModeTitle, type FormMode } from "#ui/input/form/formMode.js"
import { formModeIcon } from "#ui/input/form/formModeIcon.js"
import { LabelPseudo } from "#ui/input/label/LabelPseudo.jsx"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { classMerge } from "#ui/utils/classMerge.js"
import { Show } from "solid-js"

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
          variant={p.mode === formMode.remove || p.sm.hasErrors() ? buttonVariant.filledRed : buttonVariant.filledIndigo}
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
