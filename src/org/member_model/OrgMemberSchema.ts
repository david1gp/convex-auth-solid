import type { OrgMemberModel } from "@/org/member_model/OrgMemberModel"
import { orgRoleSchema } from "@/org/org_model/orgRole"
import { convexSystemFields, fieldsCreatedAtUpdatedAt } from "@/utils/convex/convexSystemFields"
import { handleSchema } from "@/utils/valibot/handleSchema"
import { stringSchema1to50 } from "@/utils/valibot/stringSchema"
import * as v from "valibot"
import type { DocOrgMember } from "../member_convex/IdOrgMember"

export const orgMemberDataSchemaFields = {
  orgId: stringSchema1to50,
  userId: stringSchema1to50,
  role: orgRoleSchema,
  invitedBy: handleSchema,
} as const

export const orgMemberSchema = v.object({
  ...convexSystemFields,
  ...orgMemberDataSchemaFields,
  ...fieldsCreatedAtUpdatedAt,
})

function types1(o: DocOrgMember): OrgMemberModel {
  return o
}

function types2(o: OrgMemberModel): DocOrgMember {
  return o
}

function types3(o: Omit<OrgMemberModel, "_id">): Omit<DocOrgMember, "_id"> {
  return o
}
