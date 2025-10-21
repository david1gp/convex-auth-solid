import { defineSchema } from "convex/server"
import { authTables } from "~auth/convex/authTables"

const schema = defineSchema({
  // technical
  ...authTables,
})

export default schema
