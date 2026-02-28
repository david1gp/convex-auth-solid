import { ttc } from "@/app/i18n/ttc"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import { UploadAreaImage } from "@/file/ui/upload_image/UploadAreaImage"
import { orgFormConfig, orgFormField } from "@/org/org_ui/form/orgFormField"
import { type OrgFormStateManagement } from "@/org/org_ui/form/orgFormStateManagement"
import { classesCard } from "@/ui/card/classesCard"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { mdiTrashCanOutline } from "@mdi/js"
import { Show } from "solid-js"
import { Label } from "~ui/input/label/Label"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { createSignalObject } from "~ui/utils/createSignalObject"

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
