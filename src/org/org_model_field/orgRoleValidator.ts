import { orgRoleSchema } from "#src/org/org_model_field/orgRole.ts"
import { valibotFieldToConvexValidator } from "#src/utils/convex/valibotToConvex.ts"

export const orgRoleValidator = valibotFieldToConvexValidator(orgRoleSchema)
