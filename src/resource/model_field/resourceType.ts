import * as a from "valibot"
import { valibotFieldToConvexValidator } from "#src/utils/convex/valibotToConvex.ts"

export type ResourceType = keyof typeof resourceType

export const resourceType = {
  strategy: "strategy",
  report: "report",
  policyDialogue: "policyDialogue",
  training: "training",
  survey: "survey",
  recommendation: "recommendation",
  other: "other",
} as const

export const resourceTypeSchema = a.enum(resourceType)

export const resourceTypeValidator = valibotFieldToConvexValidator(resourceTypeSchema)
