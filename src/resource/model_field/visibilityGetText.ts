import { ttc } from "#src/app/i18n/ttc.js"
import { visibility, type Visibility } from "#src/resource/model_field/visibility.js"

export function visibilityGetText(v?: string): string {
  if (!v) return ttc("Private")
  switch (v as Visibility) {
    case visibility.public:
      return ttc("Public")
    case visibility.member:
      return ttc("Authorized LEG.TJ Members")
    case visibility.org:
      return ttc("Organization Members")
  }
}
