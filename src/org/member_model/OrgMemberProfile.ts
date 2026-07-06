import * as a from "valibot"
import { type UserProfile, userProfileSchema } from "#src/auth/model/UserProfile.ts"
import type { OrgMemberModel } from "#src/org/member_model/OrgMemberModel.ts"
import { orgMemberSchemaFields } from "#src/org/member_model/OrgMemberSchema.ts"

export interface OrgMemberProfile extends OrgMemberModel {
  profile: UserProfile
}

export const orgMemberProfileSchema = a.object({
  ...orgMemberSchemaFields,
  profile: userProfileSchema,
})
