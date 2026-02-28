import { sharedMetaSection, type AppCategory } from "@/app/tabs/sharedMetaSection"
import { ttc } from "@/app/i18n/ttc"

export function sharedMetaSectionGetText(section: string) {
  switch (section as AppCategory) {
    case sharedMetaSection.image:
      return ttc("Image")
    case sharedMetaSection.display:
      return ttc("Display")
    case sharedMetaSection.description:
      return ttc("Description")
    case sharedMetaSection.technical:
      return ttc("Technical")
  }
}
