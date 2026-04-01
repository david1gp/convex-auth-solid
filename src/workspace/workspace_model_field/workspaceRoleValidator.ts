import { workspaceRole } from "#src/workspace/workspace_model_field/workspaceRole.ts"
import { v } from "convex/values"

export const workspaceRoleValidator = v.union(v.literal(workspaceRole.member), v.literal(workspaceRole.guest))
