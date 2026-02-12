import { vIdUser } from "@/auth/convex/vIdUser"
import { v } from "convex/values"

export function createUserIdValidator<T>(o: T) {
  return v.object({ ...o, userId: vIdUser })
}
