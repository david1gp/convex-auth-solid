import { authTables } from "#src/auth/convex/authTables.js"
import { fileTables } from "#src/file/convex/fileTables.js"
import { kvTables } from "#src/file/kv/kvTables.js"
import { orgInvitationTables } from "#src/org/invitation_convex/orgInvitationTables.js"
import { orgMemberTables } from "#src/org/member_convex/orgMemberTables.js"
import { orgTables } from "#src/org/org_convex/orgTables.js"
import { resourceTables } from "#src/resource/convex/resourceTables.js"
import { workspaceTables } from "#src/workspace/convex/workspaceTables.js"

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
