import { mdiFileMultiple } from "@adaptive-ds/mdi/mdiFileMultiple.js"
import { mdiInformation } from "@adaptive-ds/mdi/mdiInformation.js"
import { mdiTagMultiple } from "@adaptive-ds/mdi/mdiTagMultiple.js"
import { sharedMetaSection, sharedMetaSectionIcon } from "#src/app/tabs/sharedMetaSection.ts"

export type ResourceMetaSection = keyof typeof resourceMetaSection

export const resourceMetaSection = {
  ...sharedMetaSection,
  general: "general",
  classification: "classification",
  files: "files",
} as const

export const resourceMetaSectionIcon = {
  ...sharedMetaSectionIcon,
  general: mdiInformation,
  classification: mdiTagMultiple,
  files: mdiFileMultiple,
} as const satisfies Record<ResourceMetaSection, string>
