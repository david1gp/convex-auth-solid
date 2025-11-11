import { userProfileSchema, type UserProfile } from "@/auth/model/UserProfile"
import * as a from "valibot"

export type UserProfileDictionary = Record<string, UserProfile>

export const userProfileDistionarySchema = a.record(a.string(), userProfileSchema)
