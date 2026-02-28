import { ttc } from "@/app/i18n/ttc"
import { sharedMetaSectionGetText } from "@/app/tabs/sharedMetaSectionGetText"
import { resourceMetaSection, type ResourceMetaSection } from "@/resource/model_field/resourceMetaSection"

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
