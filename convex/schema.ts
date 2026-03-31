import { authTables } from "#src/auth/convex/authTables.ts"
import { fileTables } from "#src/file/convex/fileTables.ts"
import { kvTables } from "#src/file/kv/kvTables.ts"
import { orgInvitationTables } from "#src/org/invitation_convex/orgInvitationTables.ts"
import { orgMemberTables } from "#src/org/member_convex/orgMemberTables.ts"
import { orgTables } from "#src/org/org_convex/orgTables.ts"
import { resourceTables } from "#src/resource/convex/resourceTables.ts"
import { workspaceTables } from "#src/workspace/convex/workspaceTables.ts"

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
