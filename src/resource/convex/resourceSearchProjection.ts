import type { Language } from "#src/app/i18n/language.ts"
import type { ResourceType } from "#src/resource/model_field/resourceType.ts"
import type { Visibility } from "#src/resource/model_field/visibility.ts"

type ResourceSearchProjectionInput = {
  name?: string
  description?: string
  type?: ResourceType
  visibility?: Visibility
  language?: Language
}

export function resourceSearchProjection(resource: ResourceSearchProjectionInput) {
  const searchText = [resource.name, resource.description].filter(Boolean).join(" ")

  return {
    searchText: searchText || undefined,
    type: resource.type,
    visibility: resource.visibility,
    language: resource.language,
  }
}
