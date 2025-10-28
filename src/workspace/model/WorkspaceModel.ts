import type { HasConvexSystemFields } from "@/utils/convex/HasConvexSystemFields"
import type { HasCreatedAtUpdatedAt } from "@/utils/convex/HasCreatedAtUpdatedAt"
import type { IdWorkspace } from "@/workspace/convex/IdWorkspace"
import type { workspaceDataSchema } from "@/workspace/model/workspaceSchema"
import * as v from "valibot"

export type WorkspaceDataModel = v.InferOutput<typeof workspaceDataSchema>

export interface WorkspaceModel extends HasConvexSystemFields<IdWorkspace>, WorkspaceDataModel, HasCreatedAtUpdatedAt {}
