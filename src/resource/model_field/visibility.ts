import { v } from "convex/values"
import * as a from "valibot"

export type Visibility = keyof typeof visibility

export const visibility = {
  public: "public",
  member: "member",
  org: "org",
  // creator: "creator",
} as const

export const visibilitySchema = a.enum(visibility)

export const visibilityValidator = v.union(
  v.literal(visibility.public),
  v.literal(visibility.member),
  v.literal(visibility.org),
  // v.literal(visibility.creator),
)
