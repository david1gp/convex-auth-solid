import { language } from "#src/app/i18n/language.js"
import { languageGetText } from "#src/app/i18n/languageGetText.js"
import { ttc } from "#src/app/i18n/ttc.js"
import type { ResourceModel } from "#src/resource/model/ResourceModel.js"
import { resourceType } from "#src/resource/model_field/resourceType.js"
import { resourceTypeGetText } from "#src/resource/model_field/resourceTypeGetText.js"
import { visibility } from "#src/resource/model_field/visibility.js"
import { visibilityGetText } from "#src/resource/model_field/visibilityGetText.js"
import { resourceFormField } from "#src/resource/ui/form/resourceFormField.js"
import type { FilterFieldConfig } from "#src/ui/input/search/FilterFieldConfig.js"

export type ResourceFilterField = keyof typeof resourceFilterFields

export const resourceFilterFields = {
  type: {
    field: resourceFormField.type,
    label: () => ttc("Type"),
    options: resourceType,
    optionLabels: resourceTypeGetText,
  },
  visibility: {
    field: resourceFormField.visibility,
    label: () => ttc("Visibility"),
    options: visibility,
    optionLabels: visibilityGetText,
  },
  language: {
    field: resourceFormField.language,
    label: () => ttc("Language"),
    options: language,
    optionLabels: languageGetText,
  },
} as const satisfies Record<string, FilterFieldConfig>

export type ResourceFilterValue = {
  [K in ResourceFilterField]?: keyof (typeof resourceFilterFields)[K]["options"]
}

export function getResourceFilterOptionLabel(
  field: ResourceFilterField,
  value: keyof (typeof resourceFilterFields)[typeof field]["options"],
): string {
  const fieldConfig = resourceFilterFields[field]
  return fieldConfig.optionLabels[value] || String(value)
}

export function resourceFilterCreate() {
  return {
    type: "",
    visibility: "",
    language: "",
  } as const
}

export type ResourceFilterState = ReturnType<typeof resourceFilterCreate>

export function resourceFilter(
  resources: ResourceModel[],
  searchTerm: string,
  filters: ResourceFilterState,
): ResourceModel[] {
  return resources.filter((resource) => {
    if (filters.type && resource.type !== filters.type) {
      return false
    }
    if (filters.visibility && resource.visibility !== filters.visibility) {
      return false
    }
    if (filters.language && resource.language !== filters.language) {
      return false
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchesSearch =
        (resource.name?.toLowerCase().includes(term) || resource.description?.toLowerCase().includes(term)) ?? false
      if (!matchesSearch) return false
    }
    return true
  })
}
