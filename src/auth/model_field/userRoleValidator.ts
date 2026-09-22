import { type UserRole, userRoleSchema } from "#src/auth/model_field/userRole.ts"
import { valibotFieldToConvexValidator } from "#src/utils/convex/valibotToConvex.ts"

export const userRoleValidator = valibotFieldToConvexValidator(userRoleSchema)

function types1(a: typeof userRoleValidator.type): UserRole {
  return a
}
