import { ttc } from "@/app/i18n/ttc"
import { resourceType, type ResourceType } from "@/resource/model_field/resourceType"

export function resourceTypeGetText(type?: string): string {
  if (!type) return ttc("Unknown")
  switch (type as ResourceType) {
    case resourceType.strategy:
      return ttc("Strategy")
    case resourceType.report:
      return ttc("Report")
    case resourceType.policyDialogue:
      return ttc("Policy Dialogue")
    case resourceType.training:
      return ttc("Training")
    case resourceType.survey:
      return ttc("Survey")
    case resourceType.recommendation:
      return ttc("Recommendation")
    case resourceType.other:
      return ttc("Other")
  }
}
