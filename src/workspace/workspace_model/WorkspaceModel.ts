import type { HasConvexSystemFields } from "#src/utils/convex_client/HasConvexSystemFields.ts"
import type { HasCreatedAtUpdatedAt } from "#src/utils/data/HasCreatedAtUpdatedAt.ts"
import type { IdWorkspace } from "#src/workspace/workspace_convex/IdWorkspace.ts"
import type { workspaceDataSchema } from "#src/workspace/workspace_model/workspaceSchema.ts"
import * as a from "valibot"

export type WorkspaceDataModel = a.InferOutput<typeof workspaceDataSchema>

export interface WorkspaceModel extends HasConvexSystemFields<IdWorkspace>, WorkspaceDataModel, HasCreatedAtUpdatedAt {}
