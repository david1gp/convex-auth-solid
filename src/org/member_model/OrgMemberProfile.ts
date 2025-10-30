import type { UserProfile } from "@/auth/model/UserProfile"
import type { OrgMemberModel } from "@/org/member_model/OrgMemberModel"

export interface OrgMemberProfile extends OrgMemberModel {
  profile: UserProfile
}
