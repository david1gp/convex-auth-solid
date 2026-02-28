import { ttc } from "@/app/i18n/ttc"
import { sharedMetaSection, sharedMetaSectionIcon } from "@/app/tabs/sharedMetaSection"
import { mdiFileMultiple, mdiInformation, mdiTagMultiple } from "@mdi/js"

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
