import { ttc } from "#src/app/i18n/ttc.ts"
import type { UploadAreaFileInfo } from "#src/file/ui/stats/UploadAreaFileInfo.ts"
import { UploadAreaImage } from "#src/file/ui/upload_image/UploadAreaImage.tsx"
import { orgFormConfig, orgFormField } from "#src/org/org_ui/form/orgFormField.ts"
import { type OrgFormStateManagement } from "#src/org/org_ui/form/orgFormStateManagement.ts"
import { classesCard } from "#src/ui/card/classesCard.ts"
import { FormFieldInput } from "#src/ui/form/FormFieldInput.tsx"
import { Label } from "#ui/input/label/Label.jsx"
import { ButtonIcon } from "#ui/interactive/button/ButtonIcon.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"
import { mdiTrashCanOutline } from "@mdi/js"
import { Show } from "solid-js"

interface HasOrgFormStateManagement {
  sm: OrgFormStateManagement
}

export function OrgFormImage(p: HasOrgFormStateManagement) {
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
    p.sm.validateOnChange(orgFormField.image)("")
  }

  return (
    <div class="space-y-4">
      <Show when={hasImageUrl()}>
        <div class="flex flex-col gap-2 max-w-sm">
          <img src={p.sm.state.image.get()} alt="Organization logo preview" class="w-full" />
          <ButtonIcon icon={mdiTrashCanOutline} variant={buttonVariant.outline} class="" onClick={handleRemoveImage}>
            {ttc("Remove image")}
          </ButtonIcon>
        </div>
      </Show>

      <Show when={!hasImageUrl()}>
        <div class="flex flex-col gap-2">
          <Label>{ttc("Upload an image directly")}</Label>
          <UploadAreaImage
            hasUploaded={hasUploaded}
            info={uploadInfo}
            error={uploadError}
            onUploadSuccess={(data) => {
              p.sm.state.image.set(data.url)
              p.sm.validateOnChange(orgFormField.image)(data.url)
            }}
            class={classesCard}
          />
        </div>
      </Show>

      <FormFieldInput
        config={orgFormConfig.image}
        value={p.sm.state.image.get()}
        error={p.sm.errors.image.get()}
        mode={p.sm.mode}
        onInput={(value) => {
          p.sm.state.image.set(value)
          p.sm.validateOnChange(orgFormField.image)(value)
        }}
        onBlur={(value) => p.sm.validateOnChange(orgFormField.image)(value)}
      />
    </div>
  )
}
