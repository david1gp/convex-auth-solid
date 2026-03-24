import { ttc } from "#src/app/i18n/ttc.js"
import { sharedMetaSectionGetText } from "#src/app/tabs/sharedMetaSectionGetText.js"
import { resourceMetaSection, type ResourceMetaSection } from "#src/resource/model_field/resourceMetaSection.js"

export function resourceMetaSectionGetText(section: string) {
  switch (section as ResourceMetaSection) {
    case resourceMetaSection.general:
      return ttc("General")
    case resourceMetaSection.classification:
      return ttc("Classification")
    case resourceMetaSection.files:
      return ttc("Files")
    case resourceMetaSection.image:
      return sharedMetaSectionGetText(section)
    case resourceMetaSection.display:
      return sharedMetaSectionGetText(section)
    case resourceMetaSection.description:
      return sharedMetaSectionGetText(section)
    case resourceMetaSection.technical:
      return sharedMetaSectionGetText(section)
  }
}
