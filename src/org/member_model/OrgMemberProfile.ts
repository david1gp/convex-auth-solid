import { userProfileSchema, type UserProfile } from "@/auth/model/UserProfile"
import type { OrgMemberModel } from "@/org/member_model/OrgMemberModel"
import { orgMemberSchemaFields } from "@/org/member_model/OrgMemberSchema"
import * as a from "valibot"

export interface OrgMemberProfile extends OrgMemberModel {
  profile: UserProfile
}

export const orgMemberProfileSchema = a.object({
  ...orgMemberSchemaFields,
  profile: userProfileSchema,
})
