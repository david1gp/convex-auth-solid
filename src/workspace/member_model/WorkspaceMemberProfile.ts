import { userProfileSchema, type UserProfile } from "#src/auth/model/UserProfile.ts"
import type { WorkspaceMemberModel } from "#src/workspace/member_model/WorkspaceMemberModel.ts"
import { workspaceMemberSchemaFields } from "#src/workspace/member_model/WorkspaceMemberSchema.ts"
import * as a from "valibot"

export interface WorkspaceMemberProfile extends WorkspaceMemberModel {
  profile: UserProfile
}

export const workspaceMemberProfileSchema = a.object({
  ...workspaceMemberSchemaFields,
  profile: userProfileSchema,
})