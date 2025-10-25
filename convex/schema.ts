import { authTables } from "@/auth/convex/authTables"
import { orgTables } from "@/org/convex/orgTables"
import { defineSchema } from "convex/server"

const schema = defineSchema({
  ...authTables,
  ...orgTables,
})

export default schema
