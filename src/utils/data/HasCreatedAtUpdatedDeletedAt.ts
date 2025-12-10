import type { HasCreatedAt } from "@/utils/data/HasCreatedAt"
import type { HasUpdatedAt } from "@/utils/data/HasUpdatedAt"
import type { MayHaveDeletedAt } from "@/utils/data/MayHaveDeletedAt"

export interface HasCreatedAtUpdatedDeletedAt extends HasCreatedAt, HasUpdatedAt, MayHaveDeletedAt {}
