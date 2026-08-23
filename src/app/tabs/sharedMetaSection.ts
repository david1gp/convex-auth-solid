import { mdiCodeTags } from "@adaptive-ds/mdi/mdiCodeTags.js"
import { mdiImage } from "@adaptive-ds/mdi/mdiImage.js"
import { mdiMonitor } from "@adaptive-ds/mdi/mdiMonitor.js"
import { mdiText } from "@adaptive-ds/mdi/mdiText.js"

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
