import { vIdUser } from "#src/auth/convex/vIdUser.js"
import { v } from "convex/values"

export function createUserIdValidator<T>(o: T) {
  return v.object({ ...o, userId: vIdUser })
}
