import type { HasConvexSystemFields } from "@/utils/convex_client/HasConvexSystemFields"
import type { HasCreatedAtUpdatedAt } from "@/utils/data/HasCreatedAtUpdatedAt"
import type { IdWorkspace } from "@/workspace/convex/IdWorkspace"
import type { workspaceDataSchema } from "@/workspace/model/workspaceSchema"
import * as a from "valibot"

export type WorkspaceDataModel = a.InferOutput<typeof workspaceDataSchema>

export interface WorkspaceModel extends HasConvexSystemFields<IdWorkspace>, WorkspaceDataModel, HasCreatedAtUpdatedAt {}
