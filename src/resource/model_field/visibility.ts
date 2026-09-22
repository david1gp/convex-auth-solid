import * as a from "valibot"
import { valibotFieldToConvexValidator } from "#src/utils/convex/valibotToConvex.ts"

export type Visibility = keyof typeof visibility

export const visibility = {
  public: "public",
  member: "member",
  org: "org",
  // creator: "creator",
} as const

export const visibilitySchema = a.enum(visibility)

export const visibilityValidator = valibotFieldToConvexValidator(visibilitySchema)
