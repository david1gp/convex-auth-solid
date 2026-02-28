import { type Language, language } from "@/app/i18n/language"
import type { FileModel } from "@/file/model/FileModel"
import { type ResourceType, resourceType } from "@/resource/model_field/resourceType"
import { type Visibility, visibility } from "@/resource/model_field/visibility"
import { type SignalObject, createSignalObject } from "~ui/utils/createSignalObject"

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
