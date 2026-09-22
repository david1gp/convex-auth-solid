import { v } from "convex/values"
import { valibotFieldToConvexValidator } from "#src/utils/convex/valibotToConvex.ts"
import { tokenSchema } from "#src/utils/valibot/tokenSchema.ts"

export function createTokenValidator<T>(o: T) {
  return v.object({ ...o, token: valibotFieldToConvexValidator(tokenSchema) })
}
