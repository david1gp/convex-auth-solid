import { valibotFieldToConvexValidator } from "#src/utils/convex/valibotToConvex.ts"
import { workspaceRoleSchema } from "#src/workspace/workspace_model_field/workspaceRole.ts"

export const workspaceRoleValidator = valibotFieldToConvexValidator(workspaceRoleSchema)
