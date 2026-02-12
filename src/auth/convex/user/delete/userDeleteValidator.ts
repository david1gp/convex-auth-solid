import { vIdUser } from "@/auth/convex/vIdUser"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { v } from "convex/values"

export const userDeleteFields = {
  email: v.optional(v.string()),
} as const

export const userDeleteValidatorInternal = v.object({ ...userDeleteFields, userId: vIdUser })

export type UserDeleteValidatorInternalType = typeof userDeleteValidatorInternal.type

export const userDeleteValidatorPublic = createTokenValidator(userDeleteFields)

export type UserDeleteValidatorPublicType = typeof userDeleteValidatorPublic.type
