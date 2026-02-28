import { ttc } from "@/app/i18n/ttc"
import { visibility, type Visibility } from "@/resource/model_field/visibility"

export function visibilityGetText(v?: string): string {
  if (!v) return ttc("Private")
  switch (v as Visibility) {
    case visibility.public:
      return ttc("Public")
    case visibility.member:
      return ttc("Authorized LEG.TJ Members")
    case visibility.org:
      return ttc("Stakeholder Members")
  }
}
