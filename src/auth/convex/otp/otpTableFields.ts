import { vIdUser } from "@/auth/convex/vIdUser"
import { otpPurposeValidator } from "@/auth/model_field/otpPurpose"
import { v } from "convex/values"

export const otpTableFields = {
  // data
  userId: vIdUser,
  name: v.string(),
  email: v.string(),
  code: v.string(),
  purpose: otpPurposeValidator,
  // meta
  createdAt: v.string(),
  consumedAt: v.optional(v.string()),
} as const
