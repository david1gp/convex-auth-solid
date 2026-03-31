import { type Language, language } from "#src/app/i18n/language.ts"
import type { FileModel } from "#src/file/model/FileModel.ts"
import { type ResourceType, resourceType } from "#src/resource/model_field/resourceType.ts"
import { type Visibility, visibility } from "#src/resource/model_field/visibility.ts"
import { type SignalObject, createSignalObject } from "#ui/utils/createSignalObject.ts"

export type ResourceFormState = {
  resourceId: SignalObject<string>
  // General
  name: SignalObject<string>
  description: SignalObject<string>
  type: SignalObject<ResourceType>
  // Display
  visibility: SignalObject<Visibility>
  image: SignalObject<string>
  language: SignalObject<Language>
  // Files
  fileIds: SignalObject<FileModel[]>
}

export function resourceFormStateCreate(): ResourceFormState {
  return {
    resourceId: createSignalObject(""),
    // General
    name: createSignalObject(""),
    description: createSignalObject(""),
    type: createSignalObject<ResourceType>(resourceType.strategy),
    // Display
    visibility: createSignalObject<Visibility>(visibility.public),
    image: createSignalObject(""),
    language: createSignalObject<Language>(language.en),
    // Files
    fileIds: createSignalObject<FileModel[]>([]),
  }
}
