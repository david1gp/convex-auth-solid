import type { HasCreatedAt } from "#src/utils/data/HasCreatedAt.js"
import type { HasUpdatedAt } from "#src/utils/data/HasUpdatedAt.js"
import type { MayHaveDeletedAt } from "#src/utils/data/MayHaveDeletedAt.js"

export interface HasCreatedAtUpdatedDeletedAt extends HasCreatedAt, HasUpdatedAt, MayHaveDeletedAt {}
