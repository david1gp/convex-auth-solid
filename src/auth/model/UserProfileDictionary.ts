import { userProfileSchema, type UserProfile } from "#src/auth/model/UserProfile.js"
import * as a from "valibot"

export type UserProfileDictionary = Record<string, UserProfile>

export const userProfileDistionarySchema = a.record(a.string(), userProfileSchema)
