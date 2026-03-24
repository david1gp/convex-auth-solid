import type { HasConvexSystemFields } from "#src/utils/convex_client/HasConvexSystemFields.js"
import type { HasCreatedAtUpdatedAt } from "#src/utils/data/HasCreatedAtUpdatedAt.js"
import type { IdWorkspace } from "#src/workspace/convex/IdWorkspace.js"
import type { workspaceDataSchema } from "#src/workspace/model/workspaceSchema.js"
import * as a from "valibot"

export type WorkspaceDataModel = a.InferOutput<typeof workspaceDataSchema>

export interface WorkspaceModel extends HasConvexSystemFields<IdWorkspace>, WorkspaceDataModel, HasCreatedAtUpdatedAt {}
