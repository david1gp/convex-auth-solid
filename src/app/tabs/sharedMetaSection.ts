import { mdiCodeTags, mdiImage, mdiMonitor, mdiText } from "@mdi/js"
import { ttc } from "@/app/i18n/ttc"

export type AppCategory = keyof typeof sharedMetaSection

export const sharedMetaSection = {
  image: "image",
  display: "display",
  description: "description",
  technical: "technical",
} as const

export const sharedMetaSectionIcon = {
  [sharedMetaSection.image]: mdiImage,
  [sharedMetaSection.display]: mdiMonitor,
  [sharedMetaSection.description]: mdiText,
  [sharedMetaSection.technical]: mdiCodeTags,
} as const
