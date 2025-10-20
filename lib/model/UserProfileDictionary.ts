import * as v from "valibot"
import { userProfileSchema, type UserProfile } from "~auth/model/UserProfile"

export type UserProfileDictionary = Record<string, UserProfile>

export const userProfileDistionarySchema = v.record(v.string(), userProfileSchema)
