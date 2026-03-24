import { ttc } from "#src/app/i18n/ttc.js"
import { sharedMetaSection, type AppCategory } from "#src/app/tabs/sharedMetaSection.js"

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
