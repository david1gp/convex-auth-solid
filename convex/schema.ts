import { authTables } from "@/auth/convex/authTables"
import { fileTables } from "@/file/convex/fileTables"
import { kvTables } from "@/file/kv/kvTables"
import { orgInvitationTables } from "@/org/invitation_convex/orgInvitationTables"
import { orgMemberTables } from "@/org/member_convex/orgMemberTables"
import { orgTables } from "@/org/org_convex/orgTables"
import { resourceTables } from "@/resource/convex/resourceTables"
import { workspaceTables } from "@/workspace/convex/workspaceTables"

import { defineSchema } from "convex/server"

const schema = defineSchema({
  ...authTables,
  ...orgTables,
  ...orgInvitationTables,
  ...orgMemberTables,
  ...workspaceTables,
  ...resourceTables,
  ...fileTables,
  ...kvTables,
})

export default schema
