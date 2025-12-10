import type { HasCreatedAt } from "@/utils/data/HasCreatedAt"
import type { HasUpdatedAt } from "@/utils/data/HasUpdatedAt"

export interface HasCreatedAtUpdatedAt extends HasCreatedAt, HasUpdatedAt {}

export function createdAtUpdatedAtCreate(date: string = ""): HasCreatedAtUpdatedAt {
  return { createdAt: date, updatedAt: date }
}
