import { v } from "convex/values"
import * as a from "valibot"

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

export const resourceTypeValidator = v.union(
  v.literal(resourceType.strategy),
  v.literal(resourceType.report),
  v.literal(resourceType.policyDialogue),
  v.literal(resourceType.training),
  v.literal(resourceType.survey),
  v.literal(resourceType.recommendation),
  v.literal(resourceType.other),
)
