import { userProfileSchema, type UserProfile } from "@/auth/model/UserProfile"
import * as v from "valibot"

export type UserProfileDictionary = Record<string, UserProfile>

export const userProfileDistionarySchema = v.record(v.string(), userProfileSchema)
