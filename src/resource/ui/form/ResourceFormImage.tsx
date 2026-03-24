import { ttc } from "#src/app/i18n/ttc.js"
import type { UploadAreaFileInfo } from "#src/file/ui/stats/UploadAreaFileInfo.js"
import { UploadAreaImage } from "#src/file/ui/upload_image/UploadAreaImage.js"
import { resourceFormConfig, resourceFormField } from "#src/resource/ui/form/resourceFormField.js"
import { type ResourceFormStateManagement } from "#src/resource/ui/form/resourceFormStateManagement.js"
import { classesCard } from "#src/ui/card/classesCard.js"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.js"
import { Label } from "#ui/input/label/Label"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon"
import { buttonVariant } from "#ui/interactive/button/buttonCva"
import { createSignalObject } from "#ui/utils/createSignalObject.js"
import { mdiTrashCanOutline } from "@mdi/js"
import { Show } from "solid-js"

interface HasResourceFormStateManagement {
  sm: ResourceFormStateManagement
}

export function ResourceFormImage(p: HasResourceFormStateManagement) {
  const uploadInfo = createSignalObject<UploadAreaFileInfo | null>(null)
  const uploadError = createSignalObject<string | null>(null)

  function hasUploaded() {
    return !!uploadInfo.get()
  }

  function hasImageUrl() {
    return !!p.sm.state.image.get()
  }

  function handleRemoveImage() {
    p.sm.state.image.set("")
    p.sm.validateOnChange(resourceFormField.image)("")
  }

  return (
    <div class="space-y-4">
      <Show when={hasImageUrl()}>
        <div class="flex flex-col gap-2 max-w-sm">
          <img src={p.sm.state.image.get()} alt="Image preview" class="w-full" />
          <ButtonIcon icon={mdiTrashCanOutline} variant={buttonVariant.outline} class="" onClick={handleRemoveImage}>
            {ttc("Remove image")}
          </ButtonIcon>
        </div>
      </Show>

      <Show when={!hasImageUrl()}>
        <div class="flex flex-col gap-2">
          <Label>{ttc("Upload an image directly")}</Label>
          <UploadAreaImage
            resourceId={p.sm.state.resourceId.get()}
            hasUploaded={hasUploaded}
            info={uploadInfo}
            error={uploadError}
            onUploadSuccess={(data) => {
              p.sm.state.image.set(data.url)
              p.sm.validateOnChange(resourceFormField.image)(data.url)
            }}
            class={classesCard}
          />
        </div>
      </Show>

      <FormFieldInput
        config={resourceFormConfig.image}
        value={p.sm.state.image.get()}
        error={p.sm.errors.image.get()}
        mode={p.sm.mode}
        onInput={(value) => {
          p.sm.state.image.set(value)
          p.sm.validateOnChange(resourceFormField.image)(value)
        }}
        onBlur={(value) => p.sm.validateOnChange(resourceFormField.image)(value)}
      />
    </div>
  )
}
