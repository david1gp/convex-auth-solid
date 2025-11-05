import { authTables } from "@/auth/convex/authTables"
import { kvTables } from "@/file/kv/kvTables"
import { orgTables } from "@/org/org_convex/orgTables"
import { workspaceTables } from "@/workspace/convex/workspaceTables"
import { defineSchema } from "convex/server"

const schema = defineSchema({
  ...authTables,
  ...orgTables,
  ...workspaceTables,
  ...kvTables,
})

export default schema
