import type { HasCreatedAt } from "#src/utils/data/HasCreatedAt.js"
import type { HasUpdatedAt } from "#src/utils/data/HasUpdatedAt.js"

export interface HasCreatedAtUpdatedAt extends HasCreatedAt, HasUpdatedAt {}

export function createdAtUpdatedAtCreate(date: string = ""): HasCreatedAtUpdatedAt {
  return { createdAt: date, updatedAt: date }
}
