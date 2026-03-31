import { userProfileSchema, type UserProfile } from "#src/auth/model/UserProfile.ts"
import type { OrgMemberModel } from "#src/org/member_model/OrgMemberModel.ts"
import { orgMemberSchemaFields } from "#src/org/member_model/OrgMemberSchema.ts"
import * as a from "valibot"

export interface OrgMemberProfile extends OrgMemberModel {
  profile: UserProfile
}

export const orgMemberProfileSchema = a.object({
  ...orgMemberSchemaFields,
  profile: userProfileSchema,
})
