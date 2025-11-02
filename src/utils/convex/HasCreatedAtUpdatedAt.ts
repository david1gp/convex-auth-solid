import type { HasCreatedAt } from "@/utils/convex/HasCreatedAt"
import type { HasUpdatedAt } from "@/utils/convex/HasUpdatedAt"

export interface HasCreatedAtUpdatedAt extends HasCreatedAt, HasUpdatedAt {}

export function createdAtUpdatedAtCreate(date: string = ""): HasCreatedAtUpdatedAt {
  return { createdAt: date, updatedAt: date }
}
