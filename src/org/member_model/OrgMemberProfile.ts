import { userProfileSchema, type UserProfile } from "#src/auth/model/UserProfile.js"
import type { OrgMemberModel } from "#src/org/member_model/OrgMemberModel.js"
import { orgMemberSchemaFields } from "#src/org/member_model/OrgMemberSchema.js"
import * as a from "valibot"

export interface OrgMemberProfile extends OrgMemberModel {
  profile: UserProfile
}

export const orgMemberProfileSchema = a.object({
  ...orgMemberSchemaFields,
  profile: userProfileSchema,
})
