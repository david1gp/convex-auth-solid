import { v } from "convex/values"
import { userSessionSchema } from "#src/auth/model/UserSession.ts"
import { valibotObjectToConvexFields } from "#src/utils/convex/valibotToConvex.ts"

export const userSessionValidator = v.object(valibotObjectToConvexFields(userSessionSchema))
